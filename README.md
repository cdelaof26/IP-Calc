# IP-Calc


### Descripción
Esta aplicación web tiene el objetivo de ser una calculadora IP,
con la cual dada una IPv4 y una máscara de red, pueda realizar operaciones de
sub-netting y dar algunos datos acerca de direcciones IP de hosts. 

### Copyright
<pre>
https://github.com/cdelaof26
</pre>

Por el momento, este software no contiene una licencia, por
lo que todos los derechos están reservados - cdelaof26. 

### Dependencias
Esta página web requiere únicamente de HTML5, JS, CSS3 y 
un navegador web.

Para el desarrollo se requiere de lo siguiente:
- Navegador web
- Tailwind CSS
  - Requiere NodeJS
  - Opcionalmente: [Tailwind Standalone CLI](https://tailwindcss.com/blog/standalone-cli)


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

#### v0.0.2
- Agregado botón para el menu en `mobile`.
- Agregada validación extra para la máscara de red cuando
  es una IP.
- Agregada validación del campo opcional.
- La aplicación puede mostrar las propiedades de una dirección de host.

#### v0.0.1
- Proyecto inicial
