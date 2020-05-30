/*
 * grammar.js
 * Copyright (C) 2020 Stephan Seitz <stephan.seitz@fau.de>
 *
 * Distributed under terms of the GPLv3 license.
 */



    //{% ... %} for Statements

    //{{ ... }} for Expressions to print to the template output

    //{# ... #} for Comments not included in the template output

    //#  ... ## for Line Statements

//valid:

//{%- if foo -%}...{% endif %}

//invalid:

//{% - if foo - %}...{% endif %}

whitespace_control = /-?\+?/

module.exports = grammar ({
  name: 'jinja2',

  rules: {
    source_file: $ => repeat($._block),

    _block: $ => choice($._statement, $.expression, $.line_statement, $.comment, $.text),

    for_statement: $ => seq($.startfor, repeat($._block), $.endfor),
    startfor: $ => seq('{%', whitespace_control, /\s*for\s*/, $.jinja_stuff, whitespace_control, '%}'),
    endfor: $ => seq('{%', whitespace_control, /\s*endfor\s*/, whitespace_control, '%}'),

    if_statement: $ => seq($.startif, repeat($._block), $.endif),
    startif: $ => seq('{%', whitespace_control, /\s*if\s*/, $.jinja_stuff,  whitespace_control,'%}'),
    endif: $ => seq('{%', whitespace_control, /\s*endif\s*/, whitespace_control, '%}'),

    raw_statement: $ => seq($.startraw, $.rawtext, $.endraw),
    startraw: $ => seq('{%', whitespace_control, /\s*raw\s*/,  whitespace_control,'%}'),
    endraw: $ => seq('{%', whitespace_control, /\s*endraw\s*/, whitespace_control,'%}'),

    expression: $ => seq('{{', whitespace_control, $.jinja_stuff, whitespace_control,'}}'),
    _statement: $ => choice($.for_statement, $.if_statement, $.raw_statement),
    line_statement: $ => prec(3, seq('^#', $.jinja_stuff, optional('##'))),
    comment: $ => seq('{#', $.rawtext, '#}'),

    _text: $ =>  choice(/[^{}%#]+/, '{', '}', '#', '%'),
    _rawtext: $ =>  choice($._text, '{{', '}}', '{%', '%}', '{#', '#}'),

    jinja_stuff: $ =>  prec.left(2, repeat1($._text)),
    text: $ =>  prec.left(2, repeat1($._text)),
    rawtext: $ => prec.left(2, repeat1($._rawtext)), 
 
  }
});
