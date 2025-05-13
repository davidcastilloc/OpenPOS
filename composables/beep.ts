export const useBeep = async () => {
  try {
    await beep({
      duration: 200,
      frequency: 440,
      volume: 50
    })
  } catch (error) {
    console.error(error);
  }
}
