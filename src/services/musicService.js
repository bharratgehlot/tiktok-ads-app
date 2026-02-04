/*
 * 1. Simulates an async lookup to validate if a specific Music ID exists/is valid.
 * 2. Provides a specific success criteria (ID must end in '000') to test success UI.
 * 3. Returns specific error messages ("Invalid music ID") to test field-level error handling.
 */

export function validateMusicId(musicId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!musicId) {
        reject({
          message: 'Music Id is required'
        })
        return
      }

      if (musicId.endsWith('000')) {
        resolve({
          valid: true,
          title: 'Trending Track #1'
        })
        return
      }

      reject({
        message: 'Invalid music ID'
      })
    }, 800)
  })
}