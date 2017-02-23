#include "iostream"
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
}
