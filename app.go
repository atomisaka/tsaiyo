package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"text/template"

	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
)

func main() {
	http.HandleFunc("/", handle)
	appengine.Main()
}

func handle(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		w.WriteHeader(http.StatusOK)
		var t = template.Must(template.ParseFiles("synthesis.html"))
		if err := t.Execute(w, nil); err != nil {
			fmt.Println(err.Error())
			return
		}
	} else {
		apikey, err := ioutil.ReadFile("apikey")
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		jsonStr, _ := json.Marshal(map[string]interface{}{
			"input": map[string]string{
				"text": r.FormValue("text"),
			},
			"voice": map[string]string{
				"languageCode": "ja-JP",
			},
			"audioConfig": map[string]string{
				"audioEncoding": "MP3",
			},
		})
		ctx := appengine.NewContext(r)
		client := urlfetch.Client(ctx)
		url := "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + string(apikey)
		resp, err := client.Post(url, "application/json", bytes.NewBuffer(jsonStr))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()
		body, _ := ioutil.ReadAll(resp.Body)
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintln(w, string(body))
	}
}
