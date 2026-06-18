---
name: feedback_no-tocar-archivos-base
description: No modificar ni ejecutar comandos que puedan alterar los archivos HTML base de diagnósticos existentes
metadata:
  type: feedback
---

Nunca modificar, borrar ni ejecutar comandos que puedan alterar los archivos HTML diagnóstico existentes (como lofton-hr-riesgos.html). Esos archivos son plantillas de producción intocables.

**Why:** El usuario fue muy claro: "ese es un diagnóstico que no se toca, no se edita ni se borra". Solo se usan como referencia visual, nunca se alteran.

**How to apply:** Para crear nuevos diagnósticos, usar solo Read para inspeccionar visualmente los primeros bloques de CSS/estructura. Nunca usar Bash/sed sobre esos archivos. Escribir el nuevo archivo desde cero en un archivo diferente.
