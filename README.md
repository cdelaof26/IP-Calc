# IP-Calc

### Descripción
Esta aplicación web tiene el objetivo de ser una calculadora IP,
con la cual dada una IPv4 y una máscara de red, pueda realizar operaciones de
sub-netting y dar algunos datos acerca de direcciones IP de hosts. 

### Copyright - [Licencia](LICENSE)
<pre>
  MIT License

Copyright (c) 2024 cdelaof26

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
</pre>

### **El uso sin restricciones de este software (MIT license) se limita a las versiones superiores a v0.0.6.**


### Dependencias
Para la visualización de esta página web se requiere de 
un navegador con soporte para HTML5, JS y CSS3.

Para el desarrollo se requiere de lo siguiente:
- Navegador web
- Tailwind CSS
  - Requiere NodeJS
  - _Preferentemente_: [Tailwind Standalone CLI](https://tailwindcss.com/blog/standalone-cli)


### Historial de cambios

### v0.0.7
- Se agregó función para convertir máscaras de red
- Se mejoró el diseño en `Mobile`
- El botón para subir rápidamente ahora es visible en 
  todos los dispositivos
- Ahora el sidebar es visible cuando se carga la 
  página web en dispositivos mobiles

### v0.0.6
- Se cambiaron algunas de las etiquetas para dar más 
  claridad y se agregaron validaciones menores

### v0.0.5
- Arreglados varios errores en cálculos y agregadas varias 
  excepciones
- Se cambiaron los colores del app en modo oscuro
- Se agregó variable modificable por consola

### v0.0.4
- Agregado campo opcional `Bits para hosts`
- Agregada funcionalidad de sub netting

### v0.0.3
- Correcciones al diseño `mobile`
- Agregado botón para ver los datos de la dirección dada 
  en binario
- Agregada sección de subredes [WIP]

### v0.0.2
- Agregado botón para el menu en `mobile`.
- Agregada validación extra para la máscara de red cuando
  es una IP.
- Agregada validación del campo opcional.
- La aplicación puede mostrar las propiedades de una dirección de host.

### v0.0.1
- Proyecto inicial
