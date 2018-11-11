/**
 * @file    Adds the Digital Publishing roles to the white-list of role tokens.
 * @see     https://www.w3.org/TR/dpub-aria-1.0/
 * @author  James "Skateside" Long
 * @license MIT
 */
(function (ARIA) {

    "use strict";

    if (ARIA && ARIA.tokens) {

        ARIA.tokens.role.push(
            "doc-abstract",
            "doc-acknowledgments",
            "doc-afterword",
            "doc-appendix",
            "doc-backlink",
            "doc-biblioentry",
            "doc-bibliography",
            "doc-biblioref",
            "doc-chapter",
            "doc-colophon",
            "doc-conclusion",
            "doc-cover",
            "doc-credit",
            "doc-credits",
            "doc-dedication",
            "doc-endnote",
            "doc-endnotes",
            "doc-epigraph",
            "doc-epilogue",
            "doc-errata",
            "doc-example",
            "doc-footnote",
            "doc-foreword",
            "doc-glossary",
            "doc-glossref",
            "doc-index",
            "doc-introduction",
            "doc-noteref",
            "doc-notice",
            "doc-pagebreak",
            "doc-pagelist",
            "doc-part",
            "doc-preface",
            "doc-prologue",
            "doc-pullquote",
            "doc-qna",
            "doc-subtitle",
            "doc-tip",
            "doc-toc"
        );

    }

}(window.ARIA));

//# sourceMappingURL=aria.digitalPublishing.js.map
