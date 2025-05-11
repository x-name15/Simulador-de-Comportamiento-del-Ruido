document.addEventListener("DOMContentLoaded", () => {
  const materialData = {
      concreto: { 
          absorption: { 63: 0.01, 125: 0.01, 250: 0.02, 500: 0.02, 1000: 0.03, 2000: 0.04, 4000: 0.05 }, 
          density: 2400 
      },
      vidrio: { 
          absorption: { 63: 0.35, 125: 0.25, 250: 0.18, 500: 0.12, 1000: 0.07, 2000: 0.04, 4000: 0.03 }, 
          density: 2500 
      },
      madera: { 
          absorption: { 63: 0.15, 125: 0.12, 250: 0.10, 500: 0.09, 1000: 0.08, 2000: 0.07, 4000: 0.06 }, 
          density: 700 
      },
      metal: { 
          absorption: { 63: 0.04, 125: 0.04, 250: 0.05, 500: 0.05, 1000: 0.05, 2000: 0.04, 4000: 0.03 }, 
          density: 7800 
      },
      yeso: { 
          absorption: { 63: 0.10, 125: 0.08, 250: 0.06, 500: 0.04, 1000: 0.03, 2000: 0.02, 4000: 0.02 }, 
          density: 900 
      },
      corcho: { 
          absorption: { 63: 0.05, 125: 0.10, 250: 0.25, 500: 0.50, 1000: 0.65, 2000: 0.70, 4000: 0.75 }, 
          density: 250 
      },
  };      

  const materialDescriptions = {
      concreto: {
          title: "Concreto",
          description: "Material denso y rígido. Bueno para aislamiento a bajas frecuencias (efecto masa), pero refleja mucho el sonido, pudiendo generar reverberación si no se trata acústicamente.",
          properties: "Alta densidad (aprox. 2400 kg/m³), baja porosidad. Su coeficiente de absorción es bajo y aumenta ligeramente con la frecuencia.",
          bestFor: "Aislamiento de ruido aéreo masivo (paredes estructurales). Requiere materiales absorbentes adicionales para confort acústico interior."
      },
      vidrio: {
          title: "Vidrio",
          description: "Material no poroso y reflectante. El vidrio simple tiene poca capacidad de aislamiento, pero las unidades de doble o triple acristalamiento (DVH) mejoran significativamente el aislamiento.",
          properties: "Densidad media (aprox. 2500 kg/m³). Coeficientes de absorción muy bajos. La transmisión depende del espesor y de si es monolítico o laminado.",
          bestFor: "Ventanas. El vidrio laminado o DVH es mejor para aislamiento. Puede causar reflexiones indeseadas."
      },
      madera: {
          title: "Madera",
          description: "Varía mucho según el tipo (pino, roble, etc.), densidad y si es maciza o panel. Generalmente, absorbe más en bajas-medias frecuencias que el concreto o vidrio.",
          properties: "Densidad variable (ej. pino ~450-700 kg/m³). La absorción depende de la porosidad y la capacidad de vibrar (resonancia).",
          bestFor: "Revestimientos, paneles acústicos resonadores. Puede ofrecer un buen balance entre absorción y difusión."
      },
      metal: {
          title: "Metal (Acero)",
          description: "Muy denso y reflectante. Las planchas delgadas pueden vibrar y re-irradiar sonido (efecto diafragma).",
          properties: "Alta densidad (ej. acero ~7800 kg/m³). Coeficientes de absorción extremadamente bajos.",
          bestFor: "Estructuras. Como barrera, su efectividad depende de la masa y de evitar vibraciones."
      },
      yeso: {
          title: "Yeso (Placa de Yeso)",
          description: "Comúnmente usado en construcción en seco (drywall). Su comportamiento acústico mejora en sistemas multicapa o con aislamiento en la cámara de aire.",
          properties: "Densidad media-baja (aprox. 900 kg/m³). La placa de yeso estándar tiene absorción limitada, mejor en bajas frecuencias por flexión.",
          bestFor: "Tabiques interiores y cielorrasos. Efectivo en combinación con lana mineral/vidrio."
      },
      corcho: {
          title: "Corcho",
          description: "Material ligero y poroso con buena capacidad de absorción, especialmente en medias y altas frecuencias. También ofrece aislamiento térmico y de vibraciones.",
          properties: "Baja densidad (aprox. 250 kg/m³), alta porosidad. Buen coeficiente de absorción.",
          bestFor: "Revestimientos para absorción acústica, reducción de reverberación, aislamiento de impacto en suelos."
      }
  };

  const materialSelect = document.getElementById("material");
  const frequencyInput = document.getElementById("frequency");
  const frequencyNumber = document.getElementById("frequency-number");
  const amplitudeInput = document.getElementById("amplitude");
  const amplitudeNumber = document.getElementById("amplitude-number");
  const thicknessInput = document.getElementById("thickness");
  const simulateButton = document.getElementById("simulate");
  const canvas = document.getElementById("graph");
  const ctx = canvas.getContext("2d");

  const freqAfterSpan = document.getElementById("freq-after");
  const amplitudeSpan = document.getElementById("amplitude-after");
  const dbBeforeSpan = document.getElementById("db-before");
  const dbAfterSpan = document.getElementById("db-after");
  const dbReductionSpan = document.getElementById("db-reduction");

  let animationId = null;

  // Sincronizar inputs
  frequencyInput.addEventListener("input", () => {
    frequencyNumber.value = frequencyInput.value;
  });

  frequencyNumber.addEventListener("input", () => {
    const val = parseFloat(frequencyNumber.value);
    if (val >= 20 && val <= 20000) {
      frequencyInput.value = val;
    }
  });

  amplitudeInput.addEventListener("input", () => {
    amplitudeNumber.value = amplitudeInput.value;
  });

  amplitudeNumber.addEventListener("input", () => {
    const val = parseFloat(amplitudeNumber.value);
    if (val >= 0 && val <= 100) {
      amplitudeInput.value = val;
    }
  });

  simulateButton.addEventListener("click", () => {
    const material = materialSelect.value;
    const frequency = parseFloat(frequencyInput.value);
    const amplitude = parseFloat(amplitudeInput.value);
    const thickness = parseFloat(thicknessInput.value); // en cm
    const absorption = getAbsorptionByFrequency(material, frequency);

    simulateSound(absorption, frequency, amplitude, thickness);
  });

  // Simular diferentes coeficientes según la banda de frecuencia
  function getAbsorptionByFrequency(material, freq) {
    const materialAbsData = materialData[material].absorption;
    const bands = Object.keys(materialAbsData).map(Number).sort((a, b) => a - b);

    if (freq < bands[0]) return materialAbsData[bands[0]];
    for (let i = 0; i < bands.length - 1; i++) {
        if (freq >= bands[i] && freq < bands[i + 1]) {
            // Interpolar para mayor precisión
            const lowerBand = bands[i];
            const upperBand = bands[i + 1];
            const lowerAbs = materialAbsData[lowerBand];
            const upperAbs = materialAbsData[upperBand];
            return lowerAbs + (upperAbs - lowerAbs) * (freq - lowerBand) / (upperBand - lowerBand);
        }
    }
    return materialAbsData[bands[bands.length - 1]]; // Para frecuencias >= última banda
  }

  function amplitudeToDb(amplitude) {
      if (amplitude <= 0) return -Infinity; // o un valor muy bajo como -100 dB
      return 20 * Math.log10(amplitude / 1); // Asumiendo amplitud de referencia 1 para dBFS-like
  }

  function simulateSound(absorption, frequency, amplitude, thickness) {
    if (animationId) cancelAnimationFrame(animationId);

    canvas.width = canvas.clientWidth;
    canvas.height = 300;

    let time = 0;
    const wallX = canvas.width / 2;
    const waveSpeed = 0.5;

    const freqBefore = frequency;
    const freqAfter = freqBefore * (1 - absorption);

    const ampBefore = amplitude;

    // Atenuación exponencial basada en grosor
    // La fórmula real de pérdida de transmisión (TL) es más compleja.
    // Esta es una simplificación que usa el coeficiente de absorción.
    // TL = R (Resistencia al flujo) o Ley de Masas para particiones simples.
    // Para este simulador, mantenemos la atenuación exponencial como aproximación didáctica.
    const attenuationFactor = Math.exp(-absorption * thickness * 0.5); // Ajustado el factor de grosor
    let ampAfter = ampBefore * attenuationFactor;
    ampAfter = Math.max(ampAfter, 0.01); // Evitar amplitud cero o negativa para logaritmo

    // Mostrar resultados
    freqAfterSpan.textContent = freqAfter.toFixed(1); // Frecuencia no cambia por absorción simple
    amplitudeSpan.textContent = ampAfter.toFixed(2);

    const dbBefore = amplitudeToDb(ampBefore);
    const dbAfter = amplitudeToDb(ampAfter);
    const dbReduction = dbBefore - dbAfter;

    dbBeforeSpan.textContent = dbBefore.toFixed(1);
    dbAfterSpan.textContent = dbAfter.toFixed(1);
    dbReductionSpan.textContent = dbReduction.toFixed(1);

    function drawFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar pared
      const wallWidth = 10 + thickness / 2;
      ctx.fillStyle = "#999";
      ctx.fillRect(wallX - wallWidth / 2, 0, wallWidth, canvas.height);

      // Onda antes de la pared
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < wallX - wallWidth / 2; x++) {
        const y = canvas.height / 2 + Math.sin((x - time) * (freqBefore / 1000)) * ampBefore;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Onda después de la pared (con atenuación)
      const relativeAmplitude = ampAfter / ampBefore;
      ctx.strokeStyle = "purple";
      ctx.lineWidth = Math.max(0.5, 2 * relativeAmplitude); // Grosor de línea proporcional
      ctx.globalAlpha = Math.max(0.3, relativeAmplitude); // Opacidad proporcional

      ctx.beginPath();
      for (let x = wallX + wallWidth / 2; x < canvas.width; x++) {
        const distance = x - (wallX + wallWidth / 2);
        const distanceFactor = absorption > 0.3 ? 
          Math.exp(-distance / (300 + absorption * 500)) : 
          Math.exp(-distance / 300);
        const localAmp = ampAfter * distanceFactor;
        const y = canvas.height / 2 + Math.sin((x - time) * (freqAfter / 1000)) * localAmp;
        x === wallX + wallWidth / 2 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1.0; // Restaurar opacidad
      ctx.lineWidth = 1; // Restaurar grosor de línea

      time += waveSpeed;
      animationId = requestAnimationFrame(drawFrame);
    }

    drawFrame();
  }

  // Actualizar panel de explicación cuando cambia el material
  materialSelect.addEventListener("change", updateExplanation);

  function updateExplanation() {
      const materialKey = materialSelect.value;
      const materialInfo = materialDescriptions[materialKey];
      const currentFrequency = parseFloat(frequencyInput.value);
      const currentAbsorption = getAbsorptionByFrequency(materialKey, currentFrequency);
      const explanationPanel = document.getElementById("explanation");

      // Generar la tabla con los datos invertidos
      const absData = materialData[materialKey].absorption;
      let absorptionTableHtml = `<h4>Coeficientes de Absorción (α) para ${materialInfo.title}:</h4>
                                 <table><tr><th>Frecuencia (Hz)</th><th>α</th></tr>`;
      for (const freq in absData) {
          absorptionTableHtml += `<tr><td>${freq}</td><td>${absData[freq].toFixed(2)}</td></tr>`;
      }
      absorptionTableHtml += `</table><p>Para la frecuencia actual de ${currentFrequency.toFixed(0)} Hz, el coeficiente de absorción (α) interpolado es aprox. <strong>${currentAbsorption.toFixed(3)}</strong>.</p>`;

      // Actualizar el panel de explicación
      explanationPanel.innerHTML = `
          <h3>${materialInfo.title}</h3>
          <p><strong>Descripción:</strong> ${materialInfo.description}</p>
          <ul>
              <li><strong>Propiedades Clave:</strong> ${materialInfo.properties}</li>
              <li><strong>Usos Comunes:</strong> ${materialInfo.bestFor}</li>
          </ul>
          ${absorptionTableHtml}
          <p><strong>Nota sobre la simulación:</strong> La atenuación aquí se simplifica con la fórmula <em>Amplitud<sub>final</sub> = Amplitud<sub>inicial</sub> &times; e<sup>(-α &times; grosor &times; factor)</sup></em>. En la realidad, la pérdida de transmisión sonora (STL o TL) es más compleja e involucra la ley de masas, resonancias y efectos de coincidencia.</p>
      `;
  }

  // Llamar a updateExplanation al cargar para mostrar información inicial
  updateExplanation();
  // Simular con valores iniciales
  simulateButton.click();
});