$(function(){
    'use strict';
    
    // Variáveis globais
    var currentValue = 0;
    var isDrag = false;
    var preco_maximo = 6500000;
    var preco_atual = 0;
    var imgShow = 3;
    var maxIndex = Math.ceil($('.mini-img-wraper').length/3) - 1;
    var curIndex = 0;


    // Inicialização
    init();

    function init() {
        initPriceSlider();
        initImageSlider();
        initTestimonials();
        initMobileMenu();
        initFormValidation();
        initSmoothScroll();
        initLazyLoading();
        checkUrl();
        initCarFilters(); // Nova função para filtros de carro
    }

    // Sistema de preços (para página de venda)
    function initPriceSlider() {
        if ($('.pointer-barra').length === 0) return;

        $('.pointer-barra').on('mousedown touchstart', function(e) {
            e.preventDefault();
            isDrag = true;
            $(document).on('mousemove touchmove', handlePriceMove);
            $(document).on('mouseup touchend', function() {
                isDrag = false;
                $(document).off('mousemove touchmove mouseup touchend');
                enableTextSelection();
                applyFilters(); // Aplicar filtros após soltar o slider
            });
        });

        function handlePriceMove(e) {
            if (!isDrag) return;
            
            disableTextSelection();
            var elBase = $('.barra-preco');
            var clientX = e.originalEvent.touches ? e.originalEvent.touches[0].clientX : e.clientX;
            var mouseX = clientX - elBase.offset().left;
            
            mouseX = Math.max(0, Math.min(mouseX, elBase.width()));
            
            $('.pointer-barra').css('left', (mouseX - 13) + 'px');
            currentValue = (mouseX / elBase.width()) * 100;
            $('.barra-preco-fill').css('width', currentValue + '%');
            
            preco_atual = (currentValue / 100) * preco_maximo;
            $('.preco_pesquisa').html('R$ ' + formatarPreco(preco_atual));
        }
    }

    function formatarPreco(preco) {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(preco);
    }

    function disableTextSelection() {
        $('body').css('user-select', 'none');
    }

    function enableTextSelection() {
        $('body').css('user-select', 'auto');
    }

    // Sistema de galeria de imagens
    function initImageSlider() {
        if ($('.mini-img-wraper').length === 0) return;

        var amt = $('.mini-img-wraper').length * 33.3;
        var elScroll = $('.nav-galeria-wraper');
        var elSingle = $('.mini-img-wraper');
        
        elScroll.css('width', amt + '%');
        elSingle.css('width', 33.3 * (100 / amt) + '%');

        $('.arrow-right-nav').on('click', function() {
            if (curIndex < maxIndex) {
                curIndex++;
                var elOff = $('.mini-img-wraper').eq(curIndex * 3).offset().left - $('.nav-galeria-wraper').offset().left;
                $('.nav-galeria').animate({'scrollLeft': elOff + 'px'}, 300);
            }
        });

        $('.arrow-left-nav').on('click', function() {
            if (curIndex > 0) {
                curIndex--;
                var elOff = $('.mini-img-wraper').eq(curIndex * 3).offset().left - $('.nav-galeria-wraper').offset().left;
                $('.nav-galeria').animate({'scrollLeft': elOff + 'px'}, 300);
            }
        });

        $('.mini-img-wraper').on('click', function() {
            $('.mini-img-wraper').css('background-color', 'transparent');
            $(this).css('background-color', 'rgb(210,210,210)');
            var img = $(this).children().css('background-image');
            $('.foto-destaque').css('background-image', img);
        });

        // Selecionar primeira imagem por padrão
        $('.mini-img-wraper').eq(0).trigger('click');
    }

    // Sistema de depoimentos
    function initTestimonials() {
        if ($('.depoimento-single').length === 0) return;

        // Esconder todos os depoimentos exceto o primeiro
        $('.depoimento-single').hide();
        $('.depoimento-single').eq(0).show();

        $('[next]').on('click', function() {
            var currentDepoimento = $('.depoimento-single:visible');
            var nextDepoimento = currentDepoimento.next('.depoimento-single');
            
            if (nextDepoimento.length === 0) {
                nextDepoimento = $('.depoimento-single').first();
            }
            
            currentDepoimento.fadeOut(300);
            nextDepoimento.fadeIn(300);
        });

        $('[prev]').on('click', function() {
            var currentDepoimento = $('.depoimento-single:visible');
            var prevDepoimento = currentDepoimento.prev('.depoimento-single');
            
            if (prevDepoimento.length === 0) {
                prevDepoimento = $('.depoimento-single').last();
            }
            
            currentDepoimento.fadeOut(300);
            prevDepoimento.fadeIn(300);
        });


    }

    // Menu mobile melhorado
    function initMobileMenu() {
        // Criar overlay se não existir
        if ($('.mobile-overlay').length === 0) {
            $('body').append('<div class="mobile-overlay"></div>');
        }
        
        // Esconder menu por padrão
        $('.mobile ul').hide();
        $('.mobile-overlay').hide();
        
        // Usar o label para controlar o menu
        $('.mobile-menu-toggle-label').on('click', function(e) {
            e.preventDefault();
            var menu = $('.mobile ul');
            var overlay = $('.mobile-overlay');
            var isVisible = menu.is(':visible');
            
            if (isVisible) {
                menu.slideUp(300);
                overlay.fadeOut(300);
                $('body').removeClass('menu-open');
            } else {
                overlay.fadeIn(300);
                menu.slideDown(300);
                $('body').addClass('menu-open');
            }
        });

        // Fechar menu ao clicar em link
        $('.mobile ul a').on('click', function() {
            $('.mobile ul').slideUp(300);
            $('.mobile-overlay').fadeOut(300);
            $('body').removeClass('menu-open');
        });

        // Fechar menu ao clicar no overlay
        $('.mobile-overlay').on('click', function() {
            $('.mobile ul').slideUp(300);
            $(this).fadeOut(300);
            $('body').removeClass('menu-open');
        });
    }

    // Validação de formulário
    function initFormValidation() {
        $('form').on('submit', function(e) {
            var isValid = true;
            var form = $(this);
            
            // Remover mensagens de erro anteriores
            $('.error-message').remove();
            $('.error').removeClass('error');
            
            // Validar campos obrigatórios
            form.find('[required]').each(function() {
                var field = $(this);
                var value = field.val().trim();
                
                if (!value) {
                    showFieldError(field, 'Este campo é obrigatório');
                    isValid = false;
                }
            });
            
            // Validar email
            var emailField = form.find('input[type="email"]');
            if (emailField.length && emailField.val()) {
                var emailRegex = /^[\S+@\S+\.\S+]$/;
                if (!emailRegex.test(emailField.val())) {
                    showFieldError(emailField, 'Por favor, insira um email válido');
                    isValid = false;
                }
            }
            
            // Validar telefone
            var phoneField = form.find('input[type="tel"]');
            if (phoneField.length && phoneField.val()) {
                var phoneRegex = /^[\d\s\(\)\-\+]+$/;
                if (!phoneRegex.test(phoneField.val())) {
                    showFieldError(phoneField, 'Por favor, insira um telefone válido');
                    isValid = false;
                }
            }
            
            if (!isValid) {
                e.preventDefault();
                // Focar no primeiro campo com erro
                $('.error').first().focus();
            } else {
                // Mostrar loading
                var submitBtn = form.find('input[type="submit"]');
                submitBtn.val('Enviando...').prop('disabled', true);
                
                // Simular envio (remover em produção)
                setTimeout(function() {
                    alert('Mensagem enviada com sucesso!');
                    form[0].reset();
                    submitBtn.val('Enviar').prop('disabled', false);
                }, 1000);
                
                e.preventDefault(); // Remover em produção
            }
        });
    }

    function showFieldError(field, message) {
        field.addClass('error');
        field.after('<span class="error-message" style="color: #EB2D2D; font-size: 14px; display: block; margin-top: 5px;">' + message + '</span>');
    }

    // Scroll suave
    function initSmoothScroll() {
        $('a[href^="#"]').on('click', function(e) {
            var target = $(this.getAttribute('href'));
            if (target.length) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 100
                }, 800);
            }
        });
    }

    // Lazy loading para imagens
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            var imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    // Verificar URL para scroll automático
    function checkUrl() {
        var url = location.href.split('/');
        var curPage = url[url.length - 1].split('?');
        
        if (curPage[1] !== undefined && curPage[1] === 'contato') {
            $('header nav a').css('color', 'black');
            $('footer nav a').css('color', 'white');
            $('[href="#contato"]').css('color', '#EB2D2D');
            
            setTimeout(function() {
                $('html, body').animate({
                    'scrollTop': $('#contato').offset().top - 100
                }, 800);
            }, 100);
        }
    }

    // Melhorias de performance
    var ticking = false;
    
    function updateOnScroll() {
        // Adicionar efeitos de scroll aqui se necessário
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    $(window).on('scroll', requestTick);

    // Prevenção de FOUC (Flash of Unstyled Content)
    $(window).on('load', function() {
        $('body').addClass('loaded');
    });

    // Tratamento de erros
    window.addEventListener('error', function(e) {
        console.error('Erro JavaScript:', e.error);
    });

    // Lógica de filtragem de carros
    function initCarFilters() {
        // Só inicializar se os filtros existirem na página
        if ($('.barra-preco').length === 0 && $('input[name="ano"]').length === 0) {
            return;
        }

        // Event listener para o filtro de preço (já existente, apenas chamamos applyFilters)
        $('.barra-preco').on('mouseup touchend', function() {
            applyFilters();
        });

        // Event listeners para os checkboxes de ano
        $('input[name="ano"]').on('change', function() {
            // Se 'Todos os anos' for selecionado, desmarcar os outros
            if ($(this).val() === 'todos' && $(this).is(':checked')) {
                $('input[name="ano"]').not(this).prop('checked', false);
            } else if ($(this).val() !== 'todos' && $(this).is(':checked')) {
                // Se outro ano for selecionado, desmarcar 'Todos os anos'
                $('#ano_todos').prop('checked', false);
            } else if ($('input[name="ano"]:checked').length === 0) {
                // Se nenhum for selecionado, marcar 'Todos os anos'
                $('#ano_todos').prop('checked', true);
            }
            applyFilters();
        });

        // Inicializar o filtro ao carregar a página
        applyFilters();
    }

    function applyFilters() {
        // Só aplicar filtros se eles existirem na página
        if ($('.barra-preco').length === 0 && $('input[name="ano"]').length === 0) {
            return;
        }

        var precoMin = 0;
        var precoMax = preco_atual > 0 ? preco_atual : preco_maximo; // Usa o valor do slider ou o máximo
        
        var anosSelecionados = [];
        $('input[name="ano"]:checked').each(function() {
            anosSelecionados.push($(this).val());
        });

        // Se 'Todos os anos' estiver selecionado, não aplicar filtro de ano
        var filtrarPorAno = !anosSelecionados.includes('todos');

        $('.vitrine-destaque').each(function() {
            var carroPreco = parseFloat($(this).data('preco'));
            var carroAno = parseInt($(this).data('ano'));

            var passaNoFiltroPreco = (carroPreco >= precoMin && carroPreco <= precoMax);
            var passaNoFiltroAno = true;

            if (filtrarPorAno) {
                passaNoFiltroAno = false;
                for (var i = 0; i < anosSelecionados.length; i++) {
                    var range = anosSelecionados[i];
                    if (range === 'antes-2000') {
                        if (carroAno < 2000) {
                            passaNoFiltroAno = true;
                            break;
                        }
                    } else {
                        var anos = range.split('-');
                        var anoInicio = parseInt(anos[0]);
                        var anoFim = parseInt(anos[1]);
                        if (carroAno >= anoInicio && carroAno <= anoFim) {
                            passaNoFiltroAno = true;
                            break;
                        }
                    }
                }
            }

            if (passaNoFiltroPreco && passaNoFiltroAno) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
});

