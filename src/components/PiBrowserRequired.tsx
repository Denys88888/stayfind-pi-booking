import { useState } from 'react';
import { Smartphone, Globe, AlertTriangle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PiBrowserRequiredProps {
  onContinueDemo?: () => void;
  className?: string;
}

export default function PiBrowserRequired({ onContinueDemo, className }: PiBrowserRequiredProps) {
  const [showDetails, setShowDetails] = useState(false);

  const piBrowserSteps = [
    { step: 1, text: 'Open the Pi Network app on your phone', icon: Smartphone },
    { step: 2, text: 'Tap the Pi Browser icon at the bottom', icon: Globe },
    { step: 3, text: 'Enter your PiNet URL or scan the code below', icon: Globe },
  ];

  return (
    <div className={cn('flex flex-col items-center justify-center px-4 py-8 text-center', className)}>
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7B5EA7] to-[#9B7EC7] flex items-center justify-center mb-4">
        <Smartphone size={32} className="text-white" />
      </div>

      {/* Title */}
      <h2 className="font-display text-xl font-semibold text-[#1A2B47] mb-2">
        Pi Browser Required
      </h2>

      {/* Description */}
      <p className="font-body text-sm text-[#7A8494] max-w-[320px] mb-4">
        Pi payments work exclusively inside the Pi Browser. Please open this app in Pi Browser to continue.
      </p>

      {/* PiNet URL */}
      <div className="bg-[#F8F9FB] rounded-xl px-4 py-3 mb-4 w-full max-w-[320px]">
        <p className="font-body text-xs text-[#7A8494] uppercase tracking-wider mb-1">
          Your PiNet URL
        </p>
        <p className="font-body text-sm font-semibold text-[#7B5EA7] font-mono">
          stayfind.pinet
        </p>
      </div>

      {/* Steps */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-1 font-body text-sm text-[#E85D4A] hover:text-[#D14A38] transition-colors mb-4"
      >
        How to open in Pi Browser
        <ChevronRight
          size={14}
          className={cn('transition-transform', showDetails && 'rotate-90')}
        />
      </button>

      {showDetails && (
        <div className="w-full max-w-[320px] space-y-3 mb-6">
          {piBrowserSteps.map(({ step, text, icon: Icon }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FEF2F0] flex items-center justify-center shrink-0">
                <span className="font-body text-sm font-semibold text-[#E85D4A]">{step}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Icon size={16} className="text-[#7A8494] shrink-0" />
                <p className="font-body text-sm text-[#4A5468] text-left">{text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sandbox Banner */}
      <div className="flex items-start gap-2 bg-[#FEF2F0] rounded-xl p-3 mb-4 w-full max-w-[320px]">
        <AlertTriangle size={16} className="text-[#E8A838] shrink-0 mt-0.5" />
        <p className="font-body text-xs text-[#7A8494] text-left">
          You are currently in a regular browser. Pi SDK is only available inside Pi Browser.
        </p>
      </div>

      {/* Demo Mode Button */}
      {onContinueDemo && (
        <Button
          onClick={onContinueDemo}
          variant="outline"
          className="rounded-xl border-[#E2E6EC] font-body text-sm text-[#4A5468] hover:bg-[#F8F9FB] hover:text-[#E85D4A] px-6"
        >
          Continue in Demo Mode
          <ChevronRight size={14} className="ml-1" />
        </Button>
      )}
    </div>
  );
}


