module.exports = {
  extends: [
    'react-app'
  ],
  plugins: [
    'jsx-a11y'
  ],
  rules: {
    'jsx-a11y/no-onchange': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/select-has-associated-label': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/aria-role': 'off',
    'jsx-a11y/tabindex-no-positive': 'off'
  }
}; 