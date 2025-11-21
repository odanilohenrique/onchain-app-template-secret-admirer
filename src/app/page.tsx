'use client';

import React, { useState, useEffect } from 'react';

// --- 1. TIPAGEM PARA O TYPESCRIPT NÃO RECLAMAR ---
// Isso diz pro computador exatamente o que esperar, evitando erros de build
type PaymentResponse = {
  success: boolean;
  message?: string;
};

// --- 2. MOCK MINIKIT (SIMULAÇÃO) ---
// Simula a carteira para você poder testar sem estar no celular agora
const mockMiniKit = {
  commands: {
    pay: async (): Promise<PaymentResponse> => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1500);
      });
    }
  }
};

export default function Page() {
  // --- 3. TRAVA DE HIDRATAÇÃO (O SEGREDO DO SUCESSO) ---
  const [isMounted, setIsMounted] = useState(false);
  
  // --- 4. ESTADOS DO APP ---
  const [view, setView] = useState<'home' | 'sent' | 'inbox' | 'game' | 'result'>('home');
  const [targetUser, setTargetUser] = useState('');
  const [message, setMessage] = useState('');
  const [isFlirty, setIsFlirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState('');

  // --- 5. EFEITO DE INICIALIZAÇÃO ---
  // Só roda quando o navegador terminou de carregar tudo
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Se não estiver montado, não retorna NADA. Isso evita o erro "Client-side exception".
  if (!isMounted) {
    return <div className="min-h-screen bg-black" />;
  }

  // --- 6. LÓGICA DO APP ---
  const handleSend = () => {
    if (!targetUser || !message) return;
    setIsLoading(true);

    // Simula a IA reescrevendo
    setTimeout(() => {
      let rewrote = message;
      if (isFlirty) {
        rewrote = `Ei @${targetUser}, não consigo parar de pensar em você... ${message} 🔥😈`;
      } else {
        rewrote = `Olá @${targetUser}, alguém admira seu brilho... ${message} ✨💌`;
      }
      
      setGeneratedMessage(rewrote);
      setIsLoading(false);
      setView('sent');
    }, 2000);
  };

  const handlePay = async () => {
    setPaymentStatus('processing');
    try {
      // Chama o mock de pagamento
      const res = await mockMiniKit.commands.pay();
      if (res.success) {
        setPaymentStatus('success');
        setTimeout(() => setView('game'), 1000);
      }
    } catch (error) {
      setPaymentStatus('idle');
      alert('Erro no pagamento simulado.');
    }
  };

  const handleGuess = () => {
    // Num app real, isso viria criptografado do banco de dados
    const realSender = 'usuario_teste'; 
    
    if (guess.toLowerCase() === realSender.toLowerCase()) {
      setGameResult('win');
      setView('result');
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      if (newAttempts === 0) {
        setGameResult('lose');
        setView('result');
      } else {
        alert(`Errou! Restam ${newAttempts} tentativas.`);
      }
    }
  };

  // --- 7. RENDERIZAÇÃO VISUAL (INTERFACE) ---
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-600 text-white font-sans selection:bg-pink-500 selection:text-white">
      
      {/* TELA 1: HOME */}
      {view === 'home' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-5xl font-extrabold tracking-tighter drop-shadow-lg mb-2">
                Secret <span className="text-pink-400">Admirer</span>
              </h1>
              <p className="text-pink-200 text-lg">Envie flertes anônimos 💌</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-pink-300 block mb-2">Para quem?</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">@</span>
                  <input 
                    type="text" 
                    placeholder="username"
                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-8 pr-4 focus:outline-none focus:border-pink-500 transition-all text-white"
                    value={targetUser}
                    onChange={(e) => setTargetUser(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-pink-300 block mb-2">Mensagem</label>
                <textarea 
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-3 h-24 focus:outline-none focus:border-pink-500 transition-all resize-none text-white"
                  placeholder="Escreva o que sente..."
                  maxLength={280}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="text-right text-xs text-gray-400 mt-1">{message.length}/280</div>
              </div>

              <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl cursor-pointer" onClick={() => setIsFlirty(!isFlirty)}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{isFlirty ? '🔥' : '😇'}</span>
                  <span className="font-medium text-sm">Modo Picante</span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${isFlirty ? 'bg-orange-500' : 'bg-gray-600'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${isFlirty ? 'left-7' : 'left-1'}`} />
                </div>
              </div>

              <button 
                onClick={handleSend}
                disabled={isLoading || !targetUser || !message}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enviando...' : '🔒 Enviar Anônimo'}
              </button>
            </div>

            <button 
              onClick={() => setView('inbox')}
              className="text-xs text-white/30 hover:text-white text-center w-full mt-4 block"
            >
              [Modo Demo: Ver como Destinatário]
            </button>
          </div>
        </div>
      )}

      {/* TELA 2: ENVIADO */}
      {view === 'sent' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-black">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
            <span className="text-4xl">✈️</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Enviado! 🤫</h2>
          <p className="text-gray-400 mb-8">Sua identidade está protegida.</p>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 max-w-xs w-full mb-8">
            <p className="text-xs text-gray-500 uppercase mb-1">Como a IA reescreveu:</p>
            <p className="italic text-pink-300 text-sm">"{generatedMessage}"</p>
          </div>
          <button onClick={() => { setMessage(''); setTargetUser(''); setView('home'); }} className="text-white underline">
            Enviar outro
          </button>
        </div>
      )}

      {/* TELA 3: INBOX (DESTINATÁRIO) */}
      {view === 'inbox' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-pink-900 to-black">
          <span className="text-6xl animate-bounce mb-4">💕</span>
          <h1 className="text-3xl font-bold text-center mb-6">Você tem um Admirador!</h1>
          
          <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-pink-500/30 mb-8 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-pink-500 blur-3xl opacity-50"></div>
            <p className="text-xl font-serif text-center italic leading-relaxed text-white">
              "{generatedMessage || 'Você ilumina qualquer ambiente que entra...'}"
            </p>
          </div>

          <div className="bg-black/40 p-6 rounded-2xl w-full max-w-md border border-yellow-500/30">
            <h3 className="text-yellow-400 font-bold flex items-center gap-2 mb-2">
              <span>❓</span> Quer saber quem foi?
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Você tem <span className="font-bold text-white">3 chances</span> para adivinhar.
            </p>
            
            <button 
              onClick={handlePay}
              disabled={paymentStatus === 'processing'}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {paymentStatus === 'processing' ? 'Processando...' : '💰 Pagar 0.1 USDC'}
            </button>
          </div>
          
          <button onClick={() => setView('home')} className="mt-8 text-sm text-gray-500">Voltar ao início</button>
        </div>
      )}

      {/* TELA 4: JOGO */}
      {view === 'game' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black">
          <h2 className="text-2xl font-bold mb-6">Quem mandou isso? 🤔</h2>
          
          <div className="w-full max-w-xs space-y-4">
            <div className="text-center mb-4">
              <span className="text-6xl font-mono block mb-2">{attempts}</span>
              <p className="text-sm text-gray-400">Tentativas restantes</p>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">@</span>
              <input 
                type="text" 
                className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-8 pr-4 focus:border-pink-500 outline-none text-lg text-white"
                placeholder="username"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
              />
            </div>

            <button 
              onClick={handleGuess}
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200"
            >
              Verificar
            </button>
          </div>
        </div>
      )}

      {/* TELA 5: RESULTADO */}
      {view === 'result' && (
        <div className={`flex flex-col items-center justify-center min-h-screen p-6 text-center ${gameResult === 'win' ? 'bg-green-900' : 'bg-red-900'}`}>
          {gameResult === 'win' ? (
            <>
              <span className="text-6xl mb-4">🎉</span>
              <h1 className="text-4xl font-bold mb-2">ACERTOU!</h1>
              <p className="text-xl mb-8">Foi o <span className="font-bold text-yellow-300">@usuario_teste</span>!</p>
            </>
          ) : (
            <>
              <span className="text-6xl mb-4">❌</span>
              <h1 className="text-4xl font-bold mb-2">PERDEU!</h1>
              <p className="text-xl mb-8">Suas tentativas acabaram.</p>
              <p className="text-lg text-yellow-200">O dinheiro ficou com o criador.</p>
            </>
          )}
          <button onClick={() => setView('home')} className="mt-12 bg-white/20 px-6 py-2 rounded-full hover:bg-white/30">
            Voltar ao início
          </button>
        </div>
      )}
    </main>
  );
}