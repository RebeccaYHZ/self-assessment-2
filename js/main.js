function MainModule(listingsID = "#listings") {
  const me = {};

  const listingsElement = document.querySelector(listingsID);
  const sortSelect = document.getElementById("sortSelect");
  const sortButton = document.getElementById("sortButton");

  function getListingCode(listing, index) {
    const amenitiesJSON = listing.amenities;
    const amenitiesArray = JSON.parse(amenitiesJSON);
    const accordionId = `accordionExample-${index}`;
    return `<div class="listing col-4">
      <div class="card">
        <a href="${listing.listing_url}" class="listing-link">
          <img
            class="card-img-top"
            src="${listing.picture_url}"
            alt="Listing ID ${listing.id} Picture"
          />
  
          <h2 class="listing_name card-title">
          ${listing.name}
          </h2>
        </a>
  
        <div class="card-body">
          <div class="brief">
            <div class="host">
              <img
            
              src="${listing.host_picture_url}"
              alt="${listing.host_name}'s Host Thumbnail"
            />
            </div>
            <div class="text-container">
              <div class="host_name">👤${listing.host_name}</div>
              <div class="price">💰${listing.price}</div>
              <div class="neighborhood">
                🏠${listing.host_location}
              </div>
            </div>
          </div>
        
  
          <div class="accordion" id="${accordionId}">
            <div class="accordion-item description">
              <h3 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo-${index}" aria-expanded="false" aria-controls="collapseTwo-${index}">
                  Description
                </button>
              </h3>
              <div id="collapseTwo-${index}" class="accordion-collapse collapse" data-bs-parent="#${accordionId}">
                <div class="accordion-body">
                  <p>${listing.description}</p>
                </div>
              </div>
            </div>
  
            <div class="accordion-item amenities">
              <h3 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne-${index}" aria-expanded="false" aria-controls="collapseOne-${index}">
                  Amenities
                </button>
              </h3>
              <div id="collapseOne-${index}" class="accordion-collapse collapse" data-bs-parent="#${accordionId}">
                <div class="accordion-body">
                  <ul>
                    ${amenitiesArray
                      .map((amenity) => `<li>${amenity}</li>`)
                      .join("")}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div> 
        </div>      
      <!-- /.card -->
    </div>`;
  }

  function redraw(listings) {
    listingsElement.innerHTML = "";

    listingsElement.innerHTML = listings.map(getListingCode).join("\n");
  }

  async function loadData() {
    const res = await fetch("airbnb_sf_listings_500.json");
    me.listings = await res.json();

    me.redraw(me.listings.slice(0, 50));
    sortButton.addEventListener("click", () => {
      sortList();
    });
  }

  function parsePrice(priceString) {
    const cleanedPrice = priceString.replace(/[,$]/g, "");

    const priceAsFloat = parseFloat(cleanedPrice);

    if (!isNaN(priceAsFloat)) {
      return priceAsFloat;
    } else {
      return 0;
    }
  }

  function sortList() {
    const selectedSortOption = sortSelect.value;
    const sortedList = me.listings.slice(0, 50);

    switch (selectedSortOption) {
      case "priceAsc":
        sortedList.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case "priceDesc":
        sortedList.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
    }

    me.redraw(sortedList);
  }

  me.redraw = redraw;
  me.loadData = loadData;
  me.sortList = sortList;

  return me;
}

const main = MainModule();

main.loadData();
