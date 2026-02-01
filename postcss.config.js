const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.html', './src/**/*.ts', './src/**/*.scss'],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+(?<!:)/g) || [],
  safelist: {
    standard: [
      'html',
      'body',
      // clases globales que suelen usarse dinámicamente
      /^cdk-/,
      /^mat-/,
      /^ng-/,
      /^app-/,
      /^is-/,
      /^show-/,
      /^btn-/,
      /^active$/,
      /^theme-/,
      /^theme-dark$/
    ]
  }
});

module.exports = {
  plugins: [
    // Angular ya provee autoprefixer/other PostCSS plugins; PurgeCSS solo se aplica en producción
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : [])
  ]
};
