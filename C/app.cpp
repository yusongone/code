#include "iostream"
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
}
