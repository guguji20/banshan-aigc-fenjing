import { useState } from 'react';
import { X, Clapperboard, Loader2, Copy, Check, Send, Sparkles } from 'lucide-react';

// 导演脚本风格
const SCRIPT_STYLES = [
  { id: 'cinematic', name: '电影感', description: '专业电影叙事风格' },
  { id: 'drama', name: '剧情向', description: '注重人物情感和故事冲突' },
  { id: 'commercial', name: '广告片', description: '商业广告风格，节奏快' },
  { id: 'documentary', name: '纪录片', description: '纪实风格，自然流畅' },
  { id: 'anime', name: '动漫风', description: '二次元动漫风格' },
];

// 镜头数量
const SHOT_COUNTS = [4, 8, 12, 16, 20, 24];

interface Scene {
  id: number;
  shot: string;
  description: string;
  duration: string;
  camera: string;
}

interface DirectorScriptDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DirectorScriptDialog({ isOpen, onClose }: DirectorScriptDialogProps) {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [shotCount, setShotCount] = useState(8);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<Scene[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    // 模拟生成脚本
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 生成模拟脚本数据
    const scenes: Scene[] = Array.from({ length: shotCount }, (_, i) => ({
      id: i + 1,
      shot: `镜头 ${i + 1}`,
      description: `这是一个关于"${topic}"的镜头${i + 1}描述，展示了精彩的画面内容...`,
      duration: `${3 + Math.floor(Math.random() * 5)}秒`,
      camera: ['推镜头', '拉镜头', '摇镜头', '俯拍', '仰拍', '横移'][i % 6],
    }));

    setGeneratedScript(scenes);
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    if (!generatedScript.length) return;

    const text = generatedScript
      .map(
        (s) =>
          `${s.shot}\n描述: ${s.description}\n时长: ${s.duration}\n运镜: ${s.camera}\n`
      )
      .join('\n---\n\n');

    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-[900px] max-h-[85vh] bg-bg-light rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold">一键导演脚本生成</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-bg-dark rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          {/* 输入主题 */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">创作主题</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="输入你想要创作的主题，例如：赛博朋克城市探险、温馨的家庭故事..."
              className="w-full h-24 px-4 py-3 bg-bg-dark border border-border rounded-lg resize-none focus:border-orange-500 outline-none"
            />
          </div>

          {/* 风格选择 */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-3 block">脚本风格</label>
            <div className="flex gap-2 flex-wrap">
              {SCRIPT_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`
                    px-4 py-2 rounded-lg border transition-colors
                    ${
                      style === s.id
                        ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                        : 'border-border hover:border-gray-500'
                    }
                  `}
                >
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 镜头数量 */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-3 block">镜头数量</label>
            <div className="flex gap-2">
              {SHOT_COUNTS.map((count) => (
                <button
                  key={count}
                  onClick={() => setShotCount(count)}
                  className={`
                    px-4 py-2 rounded-lg border transition-colors
                    ${
                      shotCount === count
                        ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                        : 'border-border hover:border-gray-500'
                    }
                  `}
                >
                  {count} 个
                </button>
              ))}
            </div>
          </div>

          {/* 生成的脚本 */}
          {generatedScript.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">生成的导演脚本</h3>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300"
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {isCopied ? '已复制' : '复制脚本'}
                </button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {generatedScript.map((scene) => (
                  <div
                    key={scene.id}
                    className="p-4 bg-bg-dark rounded-lg border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-orange-400">{scene.shot}</span>
                      <span className="text-xs text-gray-500">{scene.duration}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{scene.description}</p>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">运镜: {scene.camera}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-white
              ${
                !topic.trim() || isGenerating
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-500'
              }
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                一键生成
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
