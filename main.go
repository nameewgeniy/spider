package main

import (
	"encoding/json"
	"fmt"
	"github.com/geziyor/geziyor"
	"github.com/geziyor/geziyor/client"
	"github.com/geziyor/geziyor/export"
	"regexp"
	"strings"
)

type Product struct {
	Name string
	Price string
	Brand string
	ProdID string
	Discount string
}

func main() {
	geziyor.NewGeziyor(&geziyor.Options{
		StartURLs: []string{"https://www.wildberries.ru/catalog/25807004/detail.aspx"},
		ParseFunc: parseMovies,
		Exporters: []export.Exporter{&export.JSON{}},
	}).Start()

}

func parseMovies(g *geziyor.Geziyor, r *client.Response) {

	//rePageType := regexp.MustCompile(`"PageType":.*"?`)
	reProductType := regexp.MustCompile(`(?s)google_tag_params = {.*?}`)
	result := reProductType.Find(r.Body)
	jsonData := strings.Replace(string(result), "google_tag_params = ", "", 1)

	p := Product{}
	json.Unmarshal([]byte(jsonData), &p)

	/*pr := Product{
		Name: string(reProductType.Find(r.Body)),
		Brand: string(reBrand.Find(r.Body)),
		Price: string(rePrice.Find(r.Body)),
		ID: string(reID.Find(r.Body)),
		Discount: string(reDiscount.Find(r.Body)),
	}*/

	fmt.Println(p)
}