#include "iostream"
using namespace std;


int main(){
    int age[3]={1,2,3};
    int *p_age[] = &age;

    cout << p_age << endl;

    return 1;
}

void handler(){

}




