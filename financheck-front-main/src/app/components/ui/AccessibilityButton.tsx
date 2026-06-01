const AccessibilityButton = () => {
  const handleSpeak = () => {
    const texto = document.body.innerText;
    (window as any).responsiveVoice.speak(texto, "Brazilian Portuguese Female");
  };

  const handleStop = () => {
    (window as any).responsiveVoice.cancel();
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
      <button onClick={handleSpeak} aria-label="Ativar leitura de tela">
        🔊 Ouvir página
      </button>
      <button onClick={handleStop} aria-label="Parar leitura">
        ⏹ Parar
      </button>
    </div>
  );
};

export default AccessibilityButton;
