import {Component, OnInit} from '@angular/core';
import {
  addClassToHast,
  CodeToHastOptions,
  getHighlighterCore,
} from "shiki/bundle/web";
import vitesseLightTheme from 'shiki/themes/vitesse-light.mjs';
import tsxLang from 'shiki/langs/tsx.mjs';
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import getWasm from 'shiki/wasm'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-syntax',
  standalone: true,
  template: `<div [innerHTML]="code"></div>`
})
export class SyntaxComponent implements OnInit {
  private static theme = "vitesse-light";
  private static language = 'tsx';
  code: SafeHtml = '';
  config: CodeToHastOptions = {
    lang: SyntaxComponent.language,
    theme: SyntaxComponent.theme,
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

  constructor(private sanitizer:DomSanitizer) {}

  async ngOnInit() {
    const highlighter = await getHighlighterCore({
      langs: [tsxLang],
      themes: [vitesseLightTheme],
      loadWasm: getWasm,
    });

    try {
      this.code = this.sanitizer.bypassSecurityTrustHtml(highlighter.codeToHtml(this.example, this.config));
    } catch (e) {
      if (typeof e === 'string') {
        new Error(e);
      }
    }
  }
}
