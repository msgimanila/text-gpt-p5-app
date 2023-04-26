export function TextInput({textInput, onChange, onSubmit, waiting}) {
    // const [textInput, setTextInput] = useState("");
    return (
      <div className="rounded-md border border-gray-100 shadow-md shadow-emerald-600/30 bg-white p-3">
        <h3 className="font-semibold text-gray-500 mb-2">Text prompt</h3>
        <form onSubmit={onSubmit} className="w-full">
          <textarea key="textarea-01" className="block min-h-[70px] border-[1.5px] border-emerald-500 p-2 rounded w-full mb-2 text-sm
          disabled:border-gray-300 disabled:text-gray-600 disabled:bg-gray-100"
            type="text"
            name="prompt"
            placeholder="Enter a text prompt for a p5.js sketch (e.g. Conway's Game of Life)"
            value={textInput}
            onChange={onChange}
            disabled={waiting}
          />
          { waiting ? 
          <button className="bg-gray-300 p-2 rounded w-full text-white text-sm" type="submit" disabled>
            <img src="loading.png" alt="loading icon" className="animate-spin w-4 h-4 mr-2 inline" />
            Generating p5.js code...
          </button>
          : <button className="bg-emerald-500 p-2 rounded w-full text-white text-sm cursor-pointer" type="submit">Generate p5.js code</button> }
          
        </form>
      </div>
    );
  }