export default function BmcButton() {
  return (
    <div className="flex justify-center w-full mt-2">
      <a 
        href="https://www.buymeacoffee.com/dill0" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:scale-105 transition-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://img.buymeacoffee.com/button-api/?text=Buy me a langar&emoji=🍽️&slug=dill0&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" 
          alt="Buy me a coffee" 
          className="h-[40px] md:h-[50px]"
        />
      </a>
    </div>
  );
}
