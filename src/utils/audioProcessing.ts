/**
 * Audio processing utility for Saudi License Plate Extractor.
 * Handles audio extraction, resampling, and conversion to WAV.
 */

// Helper to convert AudioBuffer to WAV Blob
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferArray = new ArrayBuffer(length);
  const view = new DataView(bufferArray);
  const channels = [];
  let i;
  let sample;
  let offset = 0;
  let pos = 0;

  // write WAVE header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit (hardcoded in this example)

  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  // write interleaved data
  for (i = 0; i < buffer.numberOfChannels; i++)
    channels.push(buffer.getChannelData(i));

  while (pos < buffer.length) {
    for (i = 0; i < numOfChan; i++) {
      // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][pos])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
      view.setInt16(44 + offset, sample, true); // write 16-bit sample
      offset += 2;
    }
    pos++;
  }

  // helper for writing strings
  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }

  return new Blob([bufferArray], { type: 'audio/wav' });
}

// Helper to convert Blob to Base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix (e.g., "data:audio/wav;base64,")
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export interface AudioChunk {
  data: string;
  mimeType: string;
}

// Helper to get fallback MIME type from filename
function getMimeType(file: File): string {
  if (file.type && file.type !== 'application/octet-stream') {
    return file.type;
  }
  const ext = file.name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'mp3':
      return 'audio/mp3';
    case 'wav':
      return 'audio/wav';
    case 'm4a':
    case 'mp4':
      return 'audio/mp4';
    case 'ogg':
      return 'audio/ogg';
    case 'aac':
      return 'audio/aac';
    case 'flac':
      return 'audio/flac';
    case 'webm':
      return 'audio/webm';
    default:
      return 'audio/mp3';
  }
}

export async function processFile(file: File): Promise<AudioChunk[]> {
  console.log(`Processing file: ${file.name} (${(file.size / 1024).toFixed(1)} KB, type: ${file.type})`);
  
  try {
    // 1. Read file as ArrayBuffer and decode audio
    const arrayBuffer = await file.arrayBuffer();
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    
    if (AudioContextClass) {
      const audioContext = new AudioContextClass();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const duration = audioBuffer.duration;
      const chunks: AudioChunk[] = [];
      const targetSampleRate = 16000;
      const targetChannels = 1;

      console.log(`Decoded audio: ${file.name}, duration: ${duration.toFixed(2)}s, sampleRate: ${audioBuffer.sampleRate}Hz`);

      // If > 15 mins (900s), split into 10-minute chunks (600s)
      if (duration > 900) {
        const CHUNK_DURATION = 600;
        let currentTime = 0;

        while (currentTime < duration) {
          const chunkDuration = Math.min(CHUNK_DURATION, duration - currentTime);
          const offlineContext = new OfflineAudioContext(
            targetChannels,
            Math.ceil(chunkDuration * targetSampleRate),
            targetSampleRate
          );

          const source = offlineContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(offlineContext.destination);
          source.start(0, currentTime, chunkDuration);

          const renderedBuffer = await offlineContext.startRendering();
          const wavBlob = audioBufferToWav(renderedBuffer);
          const base64 = await blobToBase64(wavBlob);
          chunks.push({ data: base64, mimeType: 'audio/wav' });

          currentTime += CHUNK_DURATION;
        }
        return chunks;
      } else {
        // Standard length: resample to 16kHz mono WAV
        const offlineContext = new OfflineAudioContext(
          targetChannels,
          Math.max(1, Math.ceil(duration * targetSampleRate)),
          targetSampleRate
        );

        const source = offlineContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineContext.destination);
        source.start(0);

        const renderedBuffer = await offlineContext.startRendering();
        const wavBlob = audioBufferToWav(renderedBuffer);
        const base64 = await blobToBase64(wavBlob);
        return [{ data: base64, mimeType: 'audio/wav' }];
      }
    }
  } catch (err) {
    console.warn(`Web Audio decoding failed for ${file.name}, using direct binary upload:`, err);
  }

  // Fallback if browser Web Audio API fails: read file directly with accurate MIME type
  const base64 = await blobToBase64(file);
  const mimeType = getMimeType(file);
  return [{ data: base64, mimeType }];
}
