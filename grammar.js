/**
 * @file Jinja2 grammar for tree-sitter
 * @author Uros Mrkobrada <uros.mrkobrada@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: 'jinja2',

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($._node),

    _text: $ => choice(/[^{#%}]+/, $._not),
    _not: $ => choice(/[{]([^{#%]|)/, /([^}#%]|)[}]/, /([^{]|)#([^}]|)/, /([^{]|)%([^}]|)/),

    _node: $ => choice($.statement, $.expression, $.comment, $._text),

    statement: $ => seq($.statement_begin, $.keyword, optional($._inner_text), $.statement_end),
    statement_begin: $ => seq('{%', optional($.white_space_control)),
    statement_end: $ => seq(optional($.white_space_control), '%}'),

    expression: $ => seq($.expression_begin, optional($._inner_text2), $.expression_end),
    expression_begin: $ => '{{',
    expression_end: $ => '}}',

    map: $ => seq($._map_begin, optional(seq($._inner_text2)), $._map_end),
    _map_begin: $ => '{',
    _map_end: $ => '}',
   
    comment: $ => seq('{#', /[^#]*/, '#}'),

    keyword: $ => choice('for', 'in', 'endfor', 'if', 'and', 'or', 'endif', 'else', 'elif', 'raw', 'endraw', 'macro', 'endmacro', 'extends', 'block', 'endblock', 'call', 'endcall', 'filter', 'endfilter', 'set', 'endset', 'include', 'import', 'from', 'autoescape', 'endautoescape', 'trans', 'endtrans', 'pluralize', 'with', 'endwith', 'debug', 'do', 'is'),
    white_space_control: $ => /[-+]/,
    _white_space: $ => /\s+/,

    _inner_text: $ => repeat1(choice($.keyword, field('identifier', $.dotted_identifier), field('identifier', $.identifier), $._white_space, $.operator, $.string, $.map)),
    _inner_text2: $ => repeat1(choice(field('identifier', $.dotted_identifier), field('identifier', $.identifier), $._white_space, $.operator, $.string, $.map)),


    dotted_identifier: $ => seq(field('attribute', $.identifier), repeat1(seq('.', field('attribute', $.identifier)))),
    identifier: $ => /[\w_]+/,
    operator: $ => /[^\w_{#%}'"]+/,
    string: $ => /['"][^'"]*['"]/,
  }
}) ;
