vorkNode
========

vorkNode by Bradley Matusiak

    bmatusiak@ gmail.com
    
## Installation and Usage

Requirements:

  * NodeJS `>= 0.6.15`
  * NPM `>= 1.1.16`

Install:

     get clone git://github.com/bmatusiak/vorkNode.git
     cd vorkNode
     npm install
    
## License

The GPL version 3, read it at [http://www.gnu.org/licenses/gpl.txt](http://www.gnu.org/licenses/gpl.txt)
   
## How it works

OK so my modified NoobHTTP is what is providing HTTP Server for static files
when the server gets a 404 error is directs the request to vork.mvc(req, res)

these are the steps it takes to produce output from vorkNode

`
    1.Construct URL to mvc params
`

* so lets say the url is /home/login
* controler = home
* controler.action = login

`
    2.Call Controler
`

* the return data will be sent to view(most likely a object(s))
* this can be absent if view is present

`
    3.Call View
`

* the view that gets call will have the same name as controler unless controler
* the return data will be sent to layout(This will be a string)

`
    4.Call Layout
`

* this is the last object that gets called
* if controler say layout = null then only view is output
* default layout is mvc/layout/default.js

