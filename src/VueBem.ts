/*
 Copied, converted to typscript, cleaneup and modified from 
 Anders Schmidt Hansen's code at https://gist.github.com/AndersSchmidtHansen/024cf71fec08835481d2

--------------------------------------------------------------------------
 Vue BEM Directive
--------------------------------------------------------------------------
 
 If you find yourself writing a lot of long, tedious CSS class names in
 order to be consistent with the BEM naming convention, then try this
 directive. It automagically does all the heavy lifting based on
 the component's name found in $options.name.
 
 It can produce BEM classes similar to those Harry Roberts advocate in
 this article: https://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/#namespaces
 
 With that said, if you write this for 'MyComponent:
 <div v-bem:,premium v-bem:o-media>
  <img src="" alt="" v-bem:photo v-bem:o-media,img v-bem:c-avatar />
  <p v-bem:bio v-bem:o-media,body,large>...</p>
 </div>

 It produces:
 <div class="o-media c-MyComponent c-MyComponent--premium">
  <img src="" alt="" class="o-media__img c-MyComponent__photo c-avatar">
  <p class="o-media__body c-MyComponent__bio">...</p>
 </div>
 
 A different example with a more tedious component name like
 'MyComponent':
    <div v-bem>
      <section v-bem:content>
        <div v-bem:title>{{ title }}</div>
        <p v-bem:message>{{ message }}</p>
      </section>    
      <footer v-bem:footer>
        <slot name="footer"></slot>
      </footer>
    </div>

 Produces:
 <div class="c-MyComponent">
  <section class="c-MyComponent__content">
    <div class="c-MyComponent__title"></div>
    <p class="c-MyComponent__message"></p>
  </section>    
  <footer class="c-MyComponent__footer"></footer>
 </div>

*/
import Vue, { DirectiveOptions } from 'vue'

export type VueBemConfig = {
  useCase: 'kebab' | 'default'
  alwaysIncludeBlock: boolean
  /**
   * When parsing a v-bem directives, what string seperates the modifier?. E.g. '--'
   */
  modifierSeparator: string
  /**
   * Namespace to prepend to components. Set to empty to have no prefixes. E.g. 'c-'
   */
  componentNamespace: string
  /**
   * What to prepend to element names in the css class. E.g. '__'
   */
  elementPrefix: string
  /**
   * What to prepend to modifiers in the css class. E.g. '--'
   */
  modifierPrefix: string

  /**
   * If true, all attach the component name to the 'data-cname' tag
   */
  attachComponentNameToDataAtt: boolean
}

const defaultCfg: VueBemConfig = {
  useCase: 'default',
  alwaysIncludeBlock: false,
  modifierSeparator: '--',
  componentNamespace: 'c-',
  elementPrefix: '__',
  modifierPrefix: '--',
  attachComponentNameToDataAtt: true,
}

const toKebabCaseRegExp = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*\b)[A-Z]?[a-z]+[0-9]*[A-Z][0-9]+/g
function pascalToKebabCase(s: string) {
  const matches = s?.match(toKebabCaseRegExp)
  if (!matches) {
    return s
  }
  return matches.map((m) => m.toLocaleLowerCase()).join('-')
}

export function createBemDirective(userCfg?: Partial<VueBemConfig>) {
  const cfg = { ...defaultCfg, ...userCfg }
  const convertToKebab = cfg.useCase == 'kebab'

  function attachComponentName(el: HTMLElement, compName: string) {
    if (cfg.attachComponentNameToDataAtt) {
      let attVal = el.getAttribute('data-cname')
      attVal = attVal ? `${attVal}/${compName}` : compName

      el.setAttribute('data-cname', attVal)
    }
  }

  const bemDirective: DirectiveOptions = {
    bind(el: HTMLElement, binding, vnode) {
      //the options of the component this directive is bound to
      const $options = vnode.context?.$options
      function getComponentNameBlock(): string {
        const componentName = $options?.name || 'unknown'
        return convertToKebab ? pascalToKebabCase(componentName) : componentName
      }

      if (binding.arg) {
        //args passed to directive. E.g <div v-bem:my-element,my-modifier...>, where arg will be 'my-element,my-modified

        // extract the element and modifiers if supplied
        const bemArgs = binding.arg.split(cfg.modifierSeparator)

        // Vue parsing will add anything prefixed with a '.' to the binding.modifiers
        //E.g <div v-bem:something.foo.bar.block> would have 'foo','bar', and 'block' in the modifiers object

        const hasCustomBlock =
          bemArgs[0].length > 2 ? bemArgs[0][1] == '-' : false
        if (hasCustomBlock) {
          //e.g. v-bem:u-foo   or v-bem:o-media
          //e.g. v-bem:u-foo,x
          const block = bemArgs[0]
          const element = bemArgs[1]
            ? cfg.elementPrefix + bemArgs[1]
            : undefined
          const modifier = bemArgs[2]
            ? cfg.modifierPrefix + bemArgs[2]
            : undefined
          if (element) {
            el.className = block + element + ' ' + el.className
          } else if (block) {
            el.className = block + ' ' + el.className
          }
          if (modifier) {
            if (element) {
              el.className = block + element + modifier + ' ' + el.className
            } else {
              el.className = block + modifier + ' ' + el.className
            }
          }
        } else {
          //a v-bem with elements and modifiers to be attached to the component block
          const namespace = ' ' + cfg.componentNamespace
          const compName = getComponentNameBlock()
          const block = namespace + compName
          const element = bemArgs[0]
            ? cfg.elementPrefix + bemArgs[0]
            : undefined
          const modifier = bemArgs[1]
            ? cfg.modifierPrefix + bemArgs[1]
            : undefined

          if (element) {
            el.className = block + element + ' ' + el.className
          } else {
            if (cfg.alwaysIncludeBlock && block !== '') {
              el.className = block + ' ' + el.className
            }
          }

          if (modifier) {
            el.className = block + element + modifier + ' ' + el.className
          }
        }
      } else {
        //just a 'v-bem' with no args
        const compName = getComponentNameBlock()
        const namespace = ' ' + cfg.componentNamespace
        const block = namespace + compName
        if (block !== '') {
          el.className = block + ' ' + el.className
        }

        attachComponentName(el, compName)
      }
    },
  }
  return bemDirective
}

/**
 * Function to pass to Vue.use(VueBem, customVueBemConfig) to register the directive
 *
 * @param vue - vue instance
 * @param config - custom VueBem cfg
 */
export function VueBem(vue: typeof Vue, config?: Partial<VueBemConfig>) {
  //accessible under 'v-bem'
  vue.directive('bem', createBemDirective(config))
}
// import as default and use with Vue.use(VueBem)
export default VueBem
