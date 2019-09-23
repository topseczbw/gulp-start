function login() {
  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200){
      console.log(xhr.response)
    }
  }
  xhr.open('POST', '/api/entrance/login')
  const data = 'email=zhangbowen6%40100tal.com&password=reSuCI&verifyCode=344&key=123'
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(data)
}
document.getElementById('login').onclick = function() {
  login()
}
