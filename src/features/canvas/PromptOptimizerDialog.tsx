import { useState } from 'react';
import { X, Wand2, Loader2, Copy, Check, Image, Video, Sparkles } from 'lucide-react';

type OptimizerMode = 'image' | 'video';

interface PromptOptimizerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PromptOptimizerDialog({ isOpen, onClose }: PromptOptimizerDialogProps) {
  const [mode, setMode] = useState<OptimizerMode>('image');
  const [inputPrompt, setInputPrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 文生图模式状态

  if (!isOpen) return null;

  const handleOptimize = async () => {
    if (!inputPrompt.trim()) return;

    setIsOptimizing(true);
    // 模拟优化提示词
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 简单的提示词优化
    const optimized = `${inputPrompt}, high quality, detailed, professional photography, 4k, masterpiece`;
    setOptimizedPrompt(optimized);
    setIsOptimizing(false);
  };

  const handleCopy = async () => {
    const text = mode === 'image' ? optimizedPrompt : videoPrompt;
    if (!text) return;

    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const generateVideoPrompt = async () => {
    if (!videoPrompt.trim()) return;

    setIsOptimizing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 5秒视频提示词生成逻辑
    const prompt = `0-2秒: 镜头缓缓推进，${videoPrompt}，轻微动作
2-3秒: 表情变化，眼神流转，发丝飘动
3-4秒: 背景环境动态变化
4-5秒: 完整动作展现，自然过渡结束`;

    setOptimizedPrompt(prompt);
    setIsOptimizing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-[900px] max-h-[90vh] bg-bg-light rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold">AI 提示词生成器</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-bg-dark rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 模式切换 */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setMode('image')}
            className={'flex-1 flex items-center justify-center gap-2 px-4 py-3 transition-colors ' +
              (mode === 'image' ? 'bg-purple-500/10 text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white')
            }
          >
            <Image className="w-4 h-4" />
            文生图提示词
          </button>
          <button
            onClick={() => setMode('video')}
            className={'flex-1 flex items-center justify-center gap-2 px-4 py-3 transition-colors ' +
              (mode === 'video' ? 'bg-purple-500/10 text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white')
            }
          >
            <Video className="w-4 h-4" />
            图生视频提示词
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          {mode === 'image' ? (
            <>
              {/* 简单输入框 */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">输入基础描述</label>
                <textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="输入你想要生成的内容描述..."
                  className="w-full h-24 px-4 py-3 bg-bg-dark border border-border rounded-lg resize-none focus:border-purple-500 outline-none"
                />
              </div>

              {/* 生成的优化提示词 */}
              {optimizedPrompt && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">优化后的提示词</label>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {isCopied ? '已复制' : '复制'}
                    </button>
                  </div>
                  <div className="p-4 bg-bg-dark rounded-lg border border-border">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{optimizedPrompt}</p>
                  </div>
                </div>
              )}

              {/* 快速生成按钮 */}
              <button
                onClick={handleOptimize}
                disabled={!inputPrompt.trim() || isOptimizing}
                className={'flex items-center gap-2 px-6 py-2 rounded-lg text-white ' +
                  (!inputPrompt.trim() || isOptimizing ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500')
                }
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    优化中...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    优化提示词
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* 图生视频模式 */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  图生视频提示词
                </label>
                <textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="描述图片中的主体和期望的动作，例如：少女侧身回眸，长发随风飘动..."
                  className="w-full h-32 px-4 py-3 bg-bg-dark border border-border rounded-lg resize-none focus:border-purple-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  提示：图生视频建议描述主体动作、表情变化和环境动态，系统会自动生成5秒分段控制提示词
                </p>
              </div>

              {/* 生成的视频提示词 */}
              {optimizedPrompt && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">生成的视频提示词</label>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {isCopied ? '已复制' : '复制'}
                    </button>
                  </div>
                  <div className="p-4 bg-bg-dark rounded-lg border border-border">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{optimizedPrompt}</pre>
                  </div>
                </div>
              )}

              {/* 生成按钮 */}
              <button
                onClick={generateVideoPrompt}
                disabled={!videoPrompt.trim() || isOptimizing}
                className={'flex items-center gap-2 px-6 py-2 rounded-lg text-white ' +
                  (!videoPrompt.trim() || isOptimizing ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500')
                }
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    生成视频提示词
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-bg-light">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg hover:bg-bg-dark"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
