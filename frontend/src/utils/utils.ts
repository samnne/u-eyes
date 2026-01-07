

// export function playServerAudio(pcm: string, audioContext: AudioContext) {
//   const binaryString = window.atob(pcm);
//   const len = binaryString.length;
//   let nextPlayTime = audioContext.currentTime;

//   const bytes = new Uint8Array(len);
//   for (let i = 0; i < len; i++) {
//     bytes[i] = binaryString.charCodeAt(i);
//   }

//   // 2. Convert bytes to Int16Array (Gemini's raw format)
//   // Note: 2 bytes per sample for Int16
//   const int16Data = new Int16Array(bytes.buffer);

//   // 3. Convert Int16 (-32768 to 32767) to Float32 (-1.0 to 1.0)
//   const float32Data = new Float32Array(int16Data.length);
//   for (let i = 0; i < int16Data.length; i++) {
//     // Normalization math
//     float32Data[i] =
//       int16Data[i] < 0 ? int16Data[i] / 32768 : int16Data[i] / 32767;
//   }

//   // 4. Create and play the Buffer
//   // Gemini Live is typically 24000Hz Mono
//   const buffer = audioContext.createBuffer(1, float32Data.length, 24000);
//   buffer.getChannelData(0).set(float32Data);

//   const source = audioContext.createBufferSource();
//   source.buffer = buffer;
//   source.connect(audioContext.destination);
//   if (nextPlayTime < audioContext.currentTime) {
//     nextPlayTime = audioContext.currentTime;
//   }

//   source.start(nextPlayTime);
//   nextPlayTime += buffer.duration;
// }
