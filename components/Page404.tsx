export const Page404 = ({ error = 'Something Went Wrong', href = '/', linkText = 'Go Home'}) => {
  return <div>
    {error}
    <a href={href}>{linkText}</a>
  </div>
}
