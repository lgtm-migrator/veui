import rule from '../../managers/rule'
import { normalizeValidities } from './_useValidity'
import { bindVm } from '../../utils/context'
import Vue from 'vue'
import { isPlainObject } from 'lodash'

function createRuleMixinImpl ({ getRules, getFieldValue }) {
  return new Vue({
    computed: {
      realRules () {
        let rules = getRules()
        if (!rules) {
          return []
        }

        if (Array.isArray(rules)) {
          // 直接 shallow copy，validate 是函数不能用 type.clone
          rules = rules.map((rule) =>
            isPlainObject(rule) ? { ...rule } : rule
          )
        } else {
          rules = rules
            .trim()
            .split(/\s+/)
            .map((perRule) => ({
              name: perRule,
              value: true
            }))
        }
        rule.initRules(rules)
        return rules
      },
      // Record<eventName, rule>
      interactiveRuleRecord () {
        let record = {}
        if (this.realRules) {
          this.realRules.forEach((rule) => {
            let { triggers } = rule
            if (triggers) {
              if (typeof triggers === 'string') {
                triggers = triggers.split(',')
              }

              triggers.forEach((eventName) => {
                if (eventName !== 'submit') {
                  record[eventName] = record[eventName] || []
                  record[eventName].push(rule)
                }
              })
            }
          })
        }
        return record
      }
    },
    methods: {
      /**
       * @param {*} formData 表单数据，因为ruleManager.validate需要
       * @param {Array<rule> | undefined} _rules
       * @return true | Array<Validity>
       */
      validate (formData, rules) {
        rules = rules || this.realRules
        let validities = true

        if (rules) {
          // true | Array<{name?, message?}>
          validities = rule.validate(getFieldValue(), rules, formData)
        }

        return normalizeValidities(validities)
      }
    }
  })
}

export default function useRule (namespace, deps) {
  return {
    computed: {
      [namespace] () {
        const impl = createRuleMixinImpl(bindVm(deps, this))
        return {
          getRules: () => impl.realRules,
          getInteractiveRuleRecord: () => impl.interactiveRuleRecord,
          validate: impl.validate
        }
      }
    }
  }
}
