export default function (props, defaultProps) {
  // Fix for SCRIPT1028 in Edge
  return Object.assign({}, defaultProps, props);
}
