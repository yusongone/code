{
  "targets": [
    {
      	"target_name": "test",
     	"sources": [ "test.cc" ],
		"include_dirs":["<!@(pkg-config opencv --cflags-only-I | sed s/-I//g)"]
    }
  ]
}
