import {Component, OnInit} from '@angular/core';
import {addClassToHast, CodeToHastOptions, getHighlighterCore} from "shiki";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight
} from "@shikijs/transformers";
import getWasm from 'shiki/wasm'

@Component({
  selector: 'app-syntax',
  standalone: true,
  template: `<div [innerHTML]="code"></div>`
})
export class SyntaxComponent implements OnInit {
  code = '';
  config: CodeToHastOptions = {
    lang: 'tsx',
    theme: 'material-theme-ocean',
    transformers: [
      {
        pre(node) {
          addClassToHast(node, 'sx');
        },
      },
      transformerNotationDiff({ classLineAdd: 'sx-d-a', classActivePre: 'sx-d-p', classLineRemove: 'sx-d-r'}),
      transformerNotationHighlight({ classActiveLine: 'sx-h' }),
      transformerNotationWordHighlight({ classActiveWord: 'sx-w' }),
    ]
  };

  example: string = `
    import {useEffect} from "react";
    function Example() {
      //
      useEffect(() => { // [!code highlight]
        //
      }, []); // [!code ++]
      console.log('remove'); // [!code --]
      // [!code word:return:1]
      return <div>Hello World</div>;
    }
  `;


  async ngOnInit() {
    const highlighter = await getHighlighterCore({
      themes: [() => import('shiki/themes/material-theme-ocean.mjs')],
      langs: [() => import('shiki/langs/tsx.mjs')],
      loadWasm: getWasm
    })
    try {
      this.code = await highlighter.codeToHtml(this.example, this.config);
    } catch (e) {
      if (typeof e === 'string') {
        new Error(e);
      }
    }
  }
}
