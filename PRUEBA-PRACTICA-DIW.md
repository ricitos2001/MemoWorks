# Prueba practica examen

## Arquitectura: ¿Por qué has colocado tus variables en la capa Settings y tus estilos en Components? ¿Qué pasaría si importaras Components antes que Settings en el manifiesto?

- He colocado las variables en la capa settings para poder aplicar las variables de estilo css `css-variables` en el resto de los archivos utilizando la siguiente linea en cada archivo: `@use '../00-settings/css-variables' as *;`
- He colocado los estilos en components para poder distinguir en que componente se aplican dichos estilos obteniendo un formato de estilos mucho más organizado y respetando los estilos en cascada
- Si importamos `Components` antes que `Settings` al compilar los estilos se generarian errores ya que los estilos de los componentes no encontrarían la importación de las variables

## Metodología: Explica una ventaja real que te haya aportado usar BEM en este examen frente a usar selectores de etiqueta anidados (ej: div > button).

Al usar la arquitectura BEM obtenemos un codigo mas organizado y mas facil de leer de forma que se pueden identificar las clases CSS asociadas a los elementos HTML del componente con facilidad y precision
