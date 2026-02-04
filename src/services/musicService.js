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