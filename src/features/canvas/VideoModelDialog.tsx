import { useState } from 'react';
import { X, Video, Loader2, Check, Server, Globe } from 'lucide-react';

export type VideoProvider = 'kling' | 'jimeng' | 'veo3' | 'ollama' | 'runninghub';

interface VideoModel {
  id: VideoProvider;
  name: string;
  provider: string;
  description: string;
  maxDuration: number;
  price: string;
  type: 'cloud' | 'local';
}

const VIDEO_MODELS: VideoModel[] = [
  {
    id: 'kling',
    name: '可灵 AI',
    provider: '快手',
    description: '国产最强视频生成模型，支持 5-10 秒视频',
    maxDuration: 10,
    price: '¥10/秒',
    type: 'cloud',
  },
  {
    id: 'jimeng',
    name: '即梦 AI',
    provider: '字节跳动',
    description: '字节旗下视频生成，支持多种风格',
    maxDuration: 6,
    price: '¥8/秒',
    type: 'cloud',
  },
  {
    id: 'veo3',
    name: 'Veo 3.1',
    provider: 'Google',
    description: 'Google 最新视频生成模型，业界领先',
    maxDuration: 8,
    price: '$0.5/秒',
    type: 'cloud',
  },
  {
    id: 'ollama',
    name: 'Ollama',
    provider: '本地部署',
    description: '本地大模型 API，支持多种开源模型',
    maxDuration: 5,
    price: '免费',
    type: 'local',
  },
  {
    id: 'runninghub',
    name: 'Running Hub',
    provider: 'RunningHub',
    description: 'AI 工作流平台，支持多种视频生成',
    maxDuration: 10,
    price: '按量付费',
    type: 'cloud',
  },
];

interface VideoModelDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModelDialog({ isOpen, onClose }: VideoModelDialogProps) {
  const [selectedModel, setSelectedModel] = useState<VideoProvider | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([]);
  const [showOllamaSettings, setShowOllamaSettings] = useState(false);
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llava');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!selectedModel) return;

    setIsGenerating(true);
    // 模拟生成视频
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockVideoUrl = `https://example.com/video_${Date.now()}.mp4`;
    setGeneratedVideos([...generatedVideos, mockVideoUrl]);
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-[750px] max-h-[85vh] bg-bg-light rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-pink-500" />
            <h2 className="text-lg font-semibold">AI 视频生成</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-bg-dark rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          <p className="text-sm text-gray-400 mb-4">选择视频生成模型，为选中的图片生成动态视频</p>

          {/* 模型选择 */}
          <div className="grid grid-cols-2 gap-3">
            {VIDEO_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model.id);
                  if (model.id === 'ollama') {
                    setShowOllamaSettings(true);
                  } else {
                    setShowOllamaSettings(false);
                  }
                }}
                className={`
                  p-4 rounded-lg border text-left transition-all
                  ${
                    selectedModel === model.id
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-border hover:border-gray-500'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{model.name}</span>
                    {model.type === 'local' ? (
                      <Server className="w-3 h-3 text-green-500" />
                    ) : (
                      <Globe className="w-3 h-3 text-blue-500" />
                    )}
                  </div>
                  {selectedModel === model.id && <Check className="w-4 h-4 text-pink-500" />}
                </div>
                <div className="text-xs text-gray-500 mb-1">{model.provider}</div>
                <div className="text-xs text-gray-400">{model.description}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">最长 {model.maxDuration} 秒</span>
                  <span className="text-xs text-pink-400">{model.price}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Ollama 设置 */}
          {showOllamaSettings && selectedModel === 'ollama' && (
            <div className="mt-4 p-4 bg-bg-dark rounded-lg border border-border">
              <h4 className="text-sm font-medium mb-3">Ollama 本地设置</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">API 地址</label>
                  <input
                    type="text"
                    value={ollamaEndpoint}
                    onChange={(e) => setOllamaEndpoint(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-light border border-border rounded-lg text-sm"
                    placeholder="http://localhost:11434"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">模型名称</label>
                  <select
                    value={ollamaModel}
                    onChange={(e) => setOllamaModel(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-light border border-border rounded-lg text-sm"
                  >
                    <option value="llava">llava (推荐)</option>
                    <option value="bakllava">bakllava</option>
                    <option value="moondream">moondream</option>
                    <option value="llama2">llama2</option>
                    <option value="custom">自定义...</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* RunningHub 设置 */}
          {selectedModel === 'runninghub' && (
            <div className="mt-4 p-4 bg-bg-dark rounded-lg border border-border">
              <h4 className="text-sm font-medium mb-3">Running Hub 设置</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">API Key</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 bg-bg-light border border-border rounded-lg text-sm"
                    placeholder="输入 Running Hub API Key"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">工作流 ID (可选)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-bg-light border border-border rounded-lg text-sm"
                    placeholder="留空使用默认工作流"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 已生成的视频 */}
          {generatedVideos.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">已生成视频</h3>
              <div className="grid grid-cols-3 gap-2">
                {generatedVideos.map((_, idx) => (
                  <div key={idx} className="aspect-video bg-bg-dark rounded-lg flex items-center justify-center">
                    <Video className="w-8 h-8 text-gray-600" />
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
            取消
          </button>
          <button
            onClick={handleGenerate}
            disabled={!selectedModel || isGenerating}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-white
              ${
                !selectedModel || isGenerating
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-500'
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
                <Video className="w-4 h-4" />
                生成视频
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
