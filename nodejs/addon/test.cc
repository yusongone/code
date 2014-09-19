#include <node.h>
#include <v8.h>

#include <iostream>
#include "song.h"

using namespace v8;
using namespace std;


Handle<Value> sayhello(const Arguments& args){
	HandleScope scope;
	
	return scope.Close(String::New("what")); 
}

Handle<Value> add(const Arguments& args){
	HandleScope scope;

	Local<Function> cb=Local<Function>::Cast(args[2]);
	const unsigned argc = 1;
	
	cout << "test" << endl;
	
 	Local<Value> argv[argc] = { Local<Value>::New(String::New("hello world")) };
	Local<Number> num =Number::New(args[1]->NumberValue()+args[0]->NumberValue());
	Local<Value> tt[argc]={Local<Value>::New(num)};
 	cb->Call(Context::GetCurrent()->Global(), argc, tt);
	return scope.Close(Undefined()); 
}


void init(Handle<Object> exports,Handle<Object> module){
	exports->Set(String::NewSymbol("hello"),FunctionTemplate::New(sayhello)->GetFunction());
	exports->Set(String::NewSymbol("add"),FunctionTemplate::New(add)->GetFunction());
};


NODE_MODULE(test,init);
