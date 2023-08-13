signup {username, pass} -> (Check for username and pass in db, if none add it) -> {token with username}
signin {username, pass} -> ( Check for username and pass in db, if not throw error)-> {token}
```
authorize {token} -> (
  check token for user
  if (token is expired) {
    check token for token_hash,
    check token_hash hasn't been revoked
    return new token
  } else {
    return 
  }
) -> {token}
```
