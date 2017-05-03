#include "iostream"
<<<<<<< HEAD
using namespace std;

struct Person{
  string name;
  int age;
  unsigned T:1;
};
enum Color{
  yellow=0xffff00,
  green=0x00ff00,
  blue=0xff,
  red=0xee
};


Person p[2]={
  { "yusong", 12 ,1},
  {},
};

int main(){
  Color b=blue;

  cout << p[0].T<< p[1].T<< endl;
  cout << blue <<  endl;

  return 0;
=======
#include "app.h"

using namespace std;


int APP::Test::test(){
    cout << "test" << endl; 
    return 1;
};

APP::Test::Test(){
    //this.t=1;
    cout << this << endl; 
};

APP::Test t;

int main(){

    cout << t.test() << endl; 

    APP::loop();
    APP::loop();
    APP::loop();
    APP::loop();
    APP::loop();

    int a=12;
    return 1;
};


APP::Test APP::loop(){
    APP::Test t;
    return t;
>>>>>>> 96f3d89b7916d96207a23c940a7c72ccb82d0cbc
}
