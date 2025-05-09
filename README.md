# Simulador de Comportamiento del Ruido

Este proyecto es un simulador acústico que permite visualizar cómo las ondas sonoras se atenúan al atravesar diferentes materiales. Está diseñado como una herramienta educativa para comprender los conceptos básicos de acústica y comportamiento del sonido.


## **Características del Simulador**

1. **Selección de Materiales**:
   - El usuario puede seleccionar entre diferentes materiales como concreto, vidrio, madera, metal, yeso y corcho.
   - Cada material tiene propiedades acústicas específicas, como coeficientes de absorción y densidad.

2. **Configuración de Parámetros**:
   - **Frecuencia (Hz)**: Permite ajustar la frecuencia de la onda sonora.
   - **Amplitud**: Controla la intensidad de la onda sonora.
   - **Grosor de la pared (cm)**: Define el grosor del material que atraviesa la onda.

3. **Resultados Visuales y Numéricos**:
   - Visualización de las ondas antes y después de atravesar el material.
   - Resultados numéricos que incluyen:
     - Frecuencia después del muro.
     - Amplitud después del muro.
     - Nivel sonoro antes y después (en dB).
     - Reducción sonora (en dB).

4. **Explicación Científica**:
   - Panel que muestra información detallada sobre el material seleccionado, incluyendo sus propiedades acústicas y aplicaciones comunes.
   - Tabla con los coeficientes de absorción para diferentes frecuencias.

---

## **Cómo Usar el Simulador**

1. Abre el archivo `main.html` en un navegador web.
2. Selecciona un material en el menú desplegable.
3. Ajusta los parámetros de frecuencia, amplitud y grosor de la pared.
4. Haz clic en el botón **"Simular"** para iniciar la simulación.
5. Observa los resultados visuales en el canvas y los resultados numéricos en la tabla.
6. Consulta el panel de explicación para obtener más información sobre el material seleccionado.

---

## **Tecnologías Utilizadas**

- **HTML5**: Para la estructura de la página.
- **CSS3**: Para el diseño y la apariencia.
- **JavaScript**: Para la lógica del simulador y la animación.

---

## **Estructura del Código**

### **`main.html`**
Define la interfaz de usuario, incluyendo:
- Controles para seleccionar materiales y ajustar parámetros.
- Un canvas para la visualización de las ondas.
- Una tabla para mostrar los resultados numéricos.
- Un panel de explicación científica.

### **`styles.css`**
Define el diseño de la página, asegurando que sea:
- Responsiva y compatible con diferentes navegadores.
- Visualmente clara y fácil de usar.

### **`script.js`**
Contiene la lógica del simulador:
- Cálculos físicos basados en los coeficientes de absorción de los materiales.
- Animación de las ondas antes y después de atravesar el material.
- Actualización dinámica de los resultados y el panel de explicación.

---

## **Ejemplo de Uso**

1. Selecciona el material "Concreto".
2. Ajusta la frecuencia a 1000 Hz, la amplitud a 50 y el grosor de la pared a 20 cm.
3. Haz clic en "Simular".
4. Observa cómo la onda se atenúa al atravesar el concreto y consulta los resultados en la tabla.

---

