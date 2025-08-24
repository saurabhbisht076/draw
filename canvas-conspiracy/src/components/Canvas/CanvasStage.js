import React from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { colors } from '../../utils/gameUtils';
import { Palette, Clock, Brush, RotateCcw } from 'lucide-react';
import Button from '../UI/Button';

const CanvasStage = ({ prompt, onComplete, timeLeft }) => {
  const { 
    canvasRef, 
    currentColor, 
    setCurrentColor, 
    brushSize, 
    setBrushSize, 
    startDrawing, 
    draw, 
    stopDrawing, 
    clearCanvas 
  } = useCanvas();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 60) return 'text-green-400';
    if (timeLeft > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen relative">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 w-full h-full"
        style={{
          background: `
            linear-gradient(135deg, rgba(41, 36, 97, 0.85) 0%, rgba(162, 103, 218, 0.85) 50%, rgba(28, 11, 19, 0.85) 100%)
          `,
          zIndex: -2
        }}
      />
      
      {/* Logo Background Layer */}
      <div 
        className="fixed inset-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `url('/logo512.png')`,
          backgroundSize: 'min(40vw, 40vh)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1
        }}
      />

      {/* Enhanced Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center py-4 px-4 sm:px-6 lg:px-8">
        {/* Constrained Container with Better Responsive Sizing */}
        <div className="w-full max-w-6xl mx-auto">
          
          {/* Header Section - Compact */}
          <div className="text-center mb-4 lg:mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mb-3 shadow-lg">
              <Palette className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Canvas Time!
            </h1>
          </div>

          {/* Main Canvas Container - Better Responsive Layout */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
            
            {/* Prompt and Timer Section - Combined for Space */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-4 lg:mb-6">
              {/* Prompt Section */}
              <div className="text-center lg:text-left">
                <h2 className="text-lg lg:text-xl font-bold text-white mb-2 drop-shadow-sm">Draw This:</h2>
                <div className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 px-4 py-2 rounded-xl shadow-lg">
                  <p className="text-base lg:text-lg xl:text-xl text-white font-bold drop-shadow-sm">
                    "{prompt}"
                  </p>
                </div>
              </div>

              {/* Timer Section */}
              <div className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white font-medium text-sm">Time:</span>
                <span className={`text-lg lg:text-xl font-bold ${getTimeColor()} drop-shadow-sm`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Tools Section - Improved Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4 lg:mb-6 p-3 lg:p-4 bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-white/20">
              
              {/* Color Palette */}
              <div className="xl:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-white" />
                  <span className="text-white font-semibold drop-shadow-sm text-sm lg:text-base">Colors:</span>
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-12 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl border-2 hover:scale-110 transition-all duration-200 shadow-lg ${
                        currentColor === color 
                          ? 'border-white ring-2 ring-purple-400 scale-110' 
                          : 'border-gray-400 hover:border-white'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Brush Controls and Clear Button */}
              <div className="flex flex-col gap-4">
                {/* Brush Size */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Brush className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold drop-shadow-sm text-sm lg:text-base">Brush:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={brushSize}
                      onChange={(e) => setBrushSize(e.target.value)}
                      className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(brushSize / 20) * 100}%, rgba(255,255,255,0.2) ${(brushSize / 20) * 100}%, rgba(255,255,255,0.2) 100%)`
                      }}
                    />
                    <div className="flex items-center gap-1">
                      <div 
                        className="rounded-full bg-white shadow-lg"
                        style={{ 
                          width: `${Math.max(6, brushSize * 1.5)}px`, 
                          height: `${Math.max(6, brushSize * 1.5)}px` 
                        }}
                      />
                      <span className="text-white font-mono text-xs lg:text-sm w-6 lg:w-8">{brushSize}</span>
                    </div>
                  </div>
                </div>

                {/* Clear Button */}
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={clearCanvas}
                  className="bg-red-500/20 hover:bg-red-500/30 border-red-400/30 text-white px-3 py-2 shadow-lg backdrop-blur-sm text-sm w-full"
                >
                  <RotateCcw className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Canvas Area - Properly Sized */}
            <div className="relative bg-white rounded-xl lg:rounded-2xl p-2 lg:p-4 shadow-xl border border-gray-200 mb-4 lg:mb-6">
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="w-full h-auto border-2 border-gray-300 rounded-lg lg:rounded-xl cursor-crosshair bg-white shadow-inner"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{ 
                  maxHeight: '50vh',
                  aspectRatio: '800/500'
                }}
              />
              
              {/* Canvas Info Overlay */}
              <div className="absolute top-2 right-2 lg:top-4 lg:right-4">
                <div className="px-2 py-1 bg-black/10 rounded-lg text-xs text-gray-600 font-medium">
                  {800} × {500}
                </div>
              </div>
            </div>
            
            {/* Submit Section - Compact Layout */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-4 h-4" />
                <span className="text-xs lg:text-sm font-medium text-center sm:text-left">
                  {timeLeft > 10 ? 'Take your time and be creative!' : 'Hurry up! Time is running out!'}
                </span>
              </div>
              
              <Button 
                onClick={onComplete}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 lg:px-8 py-2 lg:py-3 text-base lg:text-lg font-bold shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
              >
                <Palette className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Submit Drawing
              </Button>
            </div>
          </div>

          {/* Tips Section - Compact */}
          <div className="mt-4 lg:mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white text-xs lg:text-sm">
              <span>💡</span>
              <span>Tip: Be creative! Other players will write stories about your drawing.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasStage;