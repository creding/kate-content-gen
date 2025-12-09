import React from "react";
import { GeneratedAsset, AssetType } from "../types";
import { Card, Button, cn } from "./ui";
import { useToast } from "../contexts/ToastContext";
import { RefreshCw, Download, Copy } from "lucide-react";

interface AssetCardProps {
  asset: GeneratedAsset;
  onRegenerate?: (assetType: AssetType) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onRegenerate }) => {
  const { addToast } = useToast();

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(asset.content);
      addToast("Copied to clipboard!", "success");
    } catch {
      addToast("Failed to copy", "error");
    }
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = asset.content;
    link.download = `generated-${asset.type
      .toLowerCase()
      .replace(/\s/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Image downloaded!", "success");
  };

  return (
    <Card className="group overflow-hidden flex flex-col h-full border-zinc-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/5 hover:-translate-y-1">
      <div className="bg-zinc-50/50 px-4 py-3 border-b border-zinc-100 flex justify-between items-center backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          {asset.isImage ? (
            <div className="p-1.5 bg-zinc-100 rounded-md text-zinc-500">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          ) : (
            <div className="p-1.5 bg-zinc-100 rounded-md text-zinc-500">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          )}
          <h3 className="font-semibold text-xs text-zinc-700 tracking-wide uppercase">
            {asset.type}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
          {onRegenerate && (
            <Button
              variant="outline"
              onClick={() => onRegenerate(asset.type)}
              className="h-7 text-[10px] px-2 shadow-sm"
              title="Regenerate"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          )}
          <Button
            variant="outline"
            onClick={asset.isImage ? downloadImage : copyText}
            className="h-7 text-[10px] px-2.5 shadow-sm"
          >
            {asset.isImage ? (
              <>
                <Download className="w-3 h-3 mr-1" />
                Download
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="p-0 flex-grow flex items-center justify-center bg-white relative">
        {asset.isImage ? (
          <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-zinc-50/30 p-4">
            {/* Checkerboard pattern for transparency */}
            <div
              className="absolute inset-0 z-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              }}
            ></div>
            <img
              src={asset.content}
              alt={asset.type}
              className="max-w-full max-h-[400px] object-contain shadow-sm rounded-sm relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div className="w-full min-h-[200px] max-h-[500px] bg-white p-6 text-sm text-zinc-600 whitespace-pre-wrap font-mono leading-relaxed overflow-y-auto break-words scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
            {asset.content}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AssetCard;
