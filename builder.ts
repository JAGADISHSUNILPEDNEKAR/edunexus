class Meal{
    mainDish: string;
    sideDish: string;

    constructor(mainDish: string, sideDish: string){
        this.mainDish = mainDish;
        this.sideDish = sideDish;
    }                       
    displayMeal(): void {
        console.log(`Main Dish: ${this.mainDish}, Side Dish: ${this.sideDish}`);
    }

}
class MealBuilder{
    private mainDish: string = '';
    private sideDish: string = '';

    setMainDish(mainDish: string): MealBuilder {
        this.mainDish = mainDish;
        return this;
    }           
    setSideDish(sideDish: string): MealBuilder {                
        this.sideDish = sideDish;
        return this;
    }           
    
    build(): Meal {
        return new Meal(this.mainDish, this.sideDish);
    }   
}

// Usage
const meal = new MealBuilder()
    .setMainDish('Grilled Chicken')
    .setSideDish('Caesar Salad')
    .build();

meal.displayMeal();