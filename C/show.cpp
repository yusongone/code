#include <iostream>

using namespace std;
class Dog{
	public:
		Dog()
		{
			_age=10;
		}
		void getAge()
		{
			cout << _age << endl;
		}
		int age()
		{
			return _age;
		}
		void speek(Dog &dog){
			dog.getAge();	
		}
		bool operator ==(const Dog &dog) const{
			//cout << dog.getAge() << endl; 
			return true;
		}
		void operator <<(const Dog &dog) const{
			int d=dog.age();
			cout << d << endl; 
		}
		
	private:
		int _age;	
};


int main(int a,char** b)
{
	Dog dd;
	Dog ff;
	Dog *dog=new Dog;
	//dog->getAge();
	//dd==dog;	
	dd<<ff;
	dd.speek(dd);
//dog==dog;
	return 0;
}


