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

type WProduct struct {
	PageType string
	Ptype []string
	Pbrand string
	ProdID []uint
	Value []string
	Discount string
	Delivery string
}

type Product struct {
	Name string
	Brand string
	ID uint
	Price uint
	Discount string
	Delivery string
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

	wp := WProduct{}

	json.Unmarshal([]byte(jsonData), &wp)

	p := Product{
		Name: wp.Ptype[0],
		Brand: wp.Pbrand,
		ID: wp.ProdID[0],
		Discount: wp.Discount,
		Delivery: wp.Delivery,
		Price: string(wp.Value[0]),
	}


	fmt.Println(p)
}