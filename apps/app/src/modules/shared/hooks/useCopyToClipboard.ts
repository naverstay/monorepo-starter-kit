import toast from "react-hot-toast";

export const useCopyToClipboard = () => {
  const copyToClipboard = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      toast.error("Clipboard not supported");
      return;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      console.warn("Copy failed", error);
      toast.error("Cannot copy to clipboard");
    }
  };

  return copyToClipboard;
};
