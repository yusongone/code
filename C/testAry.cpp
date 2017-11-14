#include "iostream"

using namespace std;


class T{
	public:		
		T(){
			cout<<"default:"<<id<<endl;
		}
		T(int _id){
			id=_id;
			cout<<"create:"<<id<<endl;
		}
		void say(){
			cout<<"id"<<id<<endl;
		}
	private:
		int id;

};


int main(){

	T *f=new T();

	T abc[3]={T(20),T(30),T(50)};

	for(int i=0;i<20;i++){
		cout<< "fe:" << i<< endl;
		T *t=new T(i);
		f[i] = *t; 
	}

	abc[2].say();
	f[5].say();


	
	return 0;
}

