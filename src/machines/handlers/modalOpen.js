export const useModalOpen = (opener)  => {
  const modalOpen = async (context) => {
    const { action } = context;
    opener(action.target, action.open);
  }

  return { modalOpen }
}