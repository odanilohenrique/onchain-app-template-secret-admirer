'use client';

import React, { useState, useEffect } from 'react';

// --- 1. COMPONENTES VISUAIS INTERNOS (Para não depender de arquivos externos) ---

// Botão da Aba
const TabButton = ({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: string }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 border-b-2 flex items-center justify-center gap-2 ${
      active
        ? 'border-pink-500 text-pink-400 bg-white/5'
        : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
    }`}
  >
    <span>{icon}</span>
    {label}
  </button>
);

// Card (Caixa estilizada)
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl ${className}`}>
    {children}
  </div>
);

// --- 2. LÓGICA DO APP ---

export default function SecretAdmirerPage() {
  // --- ESTADOS ---
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'send' | 'inbox' | 'about'>('send');
  
  // Estados do fluxo de envio
  const [step, setStep] = useState<'input' | 'sending' | 'sent'>('input');
  const [targetUser, setTargetUser] = useState('');
  const [message, setMessage] = useState('');
  const [isFlirty, setIsFlirty] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');

  // Estados do fluxo de Inbox/Jogo
  const [gameStep, setGameStep] = useState<'locked' | 'paying' | 'guessing' | 'result'>('locked');
  const [attempts, setAttempts] = useState(3);
  const [guess, setGuess] = useState('');
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);

  // --- EFEITO DE MONTAGEM (Evita erro de hidratação) ---
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse">Carregando Secret Admirer...</div>
      </div>
    );
  }

  // --- FUNÇÕES ---

  const handleSend = () => {
    if (!targetUser || !message) return;
    setStep('sending');

    // Simula API
    setTimeout(() => {
      let rewrote = message;
      if (isFlirty) {
        rewrote = `Ei @${targetUser}, não consigo tirar você da cabeça... ${message} 🔥😈`;
      } else {
        rewrote = `Olá @${targetUser}, seu brilho é notável... ${message} ✨💌`;
      }
      setGeneratedMessage(rewrote);
      setStep('sent');
    }, 2000);
  };

  const handlePay = () => {
    setGameStep('paying');
    // Simula Pagamento
    setTimeout(() => {
      setGameStep('guessing');
    }, 1500);
  };

  const handleGuess = () => {
    const realSender = 'usuario_teste';
    if (guess.toLowerCase() === realSender.toLowerCase()) {
      setGameResult('win');
      setGameStep('result');
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      if (newAttempts === 0) {
        setGameResult('lose');
        setGameStep('result');
      } else {
        alert(`Errou! Restam ${newAttempts} tentativas.`);
      }
    }
  };

  const resetSend = () => {
    setMessage('');
    setTargetUser('');
    setStep('input');
  };

  // --- RENDERIZAÇÃO ---

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-pink-500 selection:text-white pb-20">
      
      {/* HEADER */}
      <div className="text-center py-8 px-4 bg-gradient-to-b from-pink-900/20 to-transparent">
        <div className="text-5xl mb-2 animate-bounce">💌</div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          Secret Admirer
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Envie mensagens anônimas turbinadas por IA
        </p>
      </div>

      {/* MENU DE ABAS (TABS) */}
      <div className="max-w-md mx-auto px-4 mb-6">
        <div className="flex bg-gray-900 rounded-t-xl border-b border-white/10">
          <TabButton 
            active={activeTab === 'send'} 
            onClick={() => setActiveTab('send')} 
            label="Enviar" 
            icon="✍️" 
          />
          <TabButton 
            active={activeTab === 'inbox'} 
            onClick={() => setActiveTab('inbox')} 
            label="Inbox (Demo)" 
            icon="📬" 
          />
           <TabButton 
            active={activeTab === 'about'} 
            onClick={() => setActiveTab('about')} 
            label="Sobre" 
            icon="ℹ️" 
          />
        </div>

        {/* CONTEÚDO DAS ABAS */}
        <div className="bg-gray-900/50 min-h-[400px] rounded-b-xl border-x border-b border-white/10 p-4">
          
          {/* ABA 1: ENVIAR */}
          {activeTab === 'send' && (
            <div className="space-y-4">
              {step === 'input' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-pink-400 uppercase">Para quem?</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">@</span>
                      <input
                        type="text"
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-8 pr-3 focus:border-pink-500 focus:outline-none transition-colors"
                        placeholder="username"
                        value={targetUser}
                        onChange={(e) => setTargetUser(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-pink-400 uppercase">Sua Mensagem</label>
                    <textarea
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 h-32 focus:border-pink-500 focus:outline-none resize-none transition-colors"
                      placeholder="Escreva seu segredo..."
                      maxLength={280}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="text-right text-xs text-gray-500">{message.length}/280</div>
                  </div>

                  <div 
                    onClick={() => setIsFlirty(!isFlirty)}
                    className={`p-3 rounded-lg border border-white/10 cursor-pointer flex items-center justify-between transition-all ${isFlirty ? 'bg-orange-900/20 border-orange-500/50' : 'bg-black/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{isFlirty ? '🔥' : '😇'}</span>
                      <div className="text-sm">
                        <span className="font-bold block">Modo Picante</span>
                        <span className="text-xs text-gray-400">{isFlirty ? 'Mensagem ousada e direta' : 'Mensagem fofa e romântica'}</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border ${isFlirty ? 'bg-orange-500 border-orange-500' : 'border-gray-500'}`} />
                  </div>

                  <button
                    onClick={handleSend}
                    disabled={!targetUser || !message}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    Enviar Anônimo
                  </button>
                </div>
              )}

              {step === 'sending' && (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-pink-400 animate-pulse">A IA está reescrevendo sua mensagem...</p>
                </div>
              )}

              {step === 'sent' && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl border border-green-500/50">
                    ✓
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Enviado!</h2>
                  <p className="text-gray-400 text-sm mb-6">Sua identidade foi protegida criptograficamente.</p>
                  
                  <Card className="bg-black/40 p-4 mb-6 text-left">
                    <p className="text-xs text-gray-500 uppercase mb-2">Preview da IA:</p>
                    <p className="text-pink-300 italic">"{generatedMessage}"</p>
                  </Card>

                  <button onClick={resetSend} className="text-pink-400 hover:text-pink-300 text-sm underline">
                    Enviar nova mensagem
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ABA 2: INBOX (DEMONSTRAÇÃO) */}
          {activeTab === 'inbox' && (
            <div className="space-y-6 text-center">
              {gameStep === 'locked' && (
                <>
                  <div className="py-6">
                    <p className="text-gray-400 text-sm mb-4">Você recebeu uma mensagem anônima:</p>
                    <Card className="p-6 bg-gradient-to-br from-pink-900/40 to-black border-pink-500/30">
                      <p className="text-lg italic text-pink-100">"{generatedMessage || 'Sua energia ilumina qualquer lugar que você chega...'}"</p>
                    </Card>
                  </div>
                  
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                    <h3 className="text-yellow-400 font-bold mb-2">Quer saber quem foi?</h3>
                    <p className="text-xs text-gray-400 mb-4">Pague uma pequena taxa para tentar adivinhar.</p>
                    <button 
                      onClick={handlePay}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                      💰 Pagar 0.1 USDC
                    </button>
                  </div>
                </>
              )}

              {gameStep === 'paying' && (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin text-4xl mb-4">💸</div>
                  <p className="text-yellow-400">Processando pagamento...</p>
                </div>
              )}

              {gameStep === 'guessing' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Quem é o Admirador?</h3>
                  <div className="text-4xl font-mono text-pink-500 mb-2">{attempts}</div>
                  <p className="text-xs text-gray-400">Tentativas restantes</p>

                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">@</span>
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-8 focus:border-pink-500 focus:outline-none"
                      placeholder="Digite o username"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleGuess}
                    className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200"
                  >
                    Verificar
                  </button>
                </div>
              )}

              {gameStep === 'result' && (
                <div className="py-8">
                  {gameResult === 'win' ? (
                    <>
                      <div className="text-6xl mb-4">🎉</div>
                      <h2 className="text-2xl font-bold text-green-400 mb-2">VOCÊ ACERTOU!</h2>
                      <p className="text-gray-300">Foi o <span className="font-bold text-white">@usuario_teste</span></p>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl mb-4">😈</div>
                      <h2 className="text-2xl font-bold text-red-400 mb-2">VOCÊ ERROU!</h2>
                      <p className="text-gray-300">O dinheiro ficou com a casa.</p>
                    </>
                  )}
                  <button 
                    onClick={() => { setGameStep('locked'); setAttempts(3); setGuess(''); }}
                    className="mt-8 text-sm underline text-gray-500"
                  >
                    Reiniciar Demo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ABA 3: SOBRE */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-sm text-gray-300">
              <h3 className="font-bold text-white text-lg">Como funciona?</h3>
              <p>Secret Admirer permite enviar mensagens anônimas para outros usuários do Farcaster.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Escolha o destinatário</li>
                <li>Escreva sua mensagem bruta</li>
                <li>Nossa IA (Grok) reescreve para torná-la mais envolvente (ou picante!)</li>
                <li>O destinatário pode pagar para tentar adivinhar quem mandou.</li>
              </ul>
              <div className="mt-8 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <p className="text-xs text-blue-300">Desenvolvido para o Farcaster Mini App Hackathon.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}