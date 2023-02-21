import { useState } from "react";

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text); // Way to copy text
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    copyTextToClipboard(text)
      .then(() => {
        // On success update copied value
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <button
      className="rounded-full bg-blue-400 py-2 px-4 font-bold text-white hover:bg-blue-700"
      onClick={handleCopyClick}
    >
      <span>{isCopied ? "Copied!" : "Copy"}</span>
    </button>
  );
};

export default CopyButton;
